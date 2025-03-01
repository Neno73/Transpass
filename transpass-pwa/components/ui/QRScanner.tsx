import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode, Html5QrcodeScannerState, Html5QrcodeSupportedFormats } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (decodedText: string, decodedResult?: any) => void;
  onScanError?: (error: any) => void;
  width?: number;
  height?: number;
  fps?: number;
  qrbox?: number | { width: number; height: number } | ((viewfinderWidth: number, viewfinderHeight: number) => { width: number; height: number });
  aspectRatio?: number;
  disableFlip?: boolean;
  scanDelay?: number;
  formatsToSupport?: Html5QrcodeSupportedFormats[];
  verbose?: boolean;
}

export default function QRScanner({ 
  onScanSuccess, 
  onScanError, 
  width = 250, 
  height = 250,
  fps = 10,
  qrbox,
  aspectRatio = 1,
  disableFlip = false,
  scanDelay = 100,
  formatsToSupport = [Html5QrcodeSupportedFormats.QR_CODE],
  verbose = false
}: QRScannerProps) {
  // State for camera management
  const [cameras, setCameras] = useState<Array<{ id: string; label: string }>>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [isScanning, setIsScanning] = useState<boolean>(false);
  
  // State for error handling
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isBrowserSupported, setIsBrowserSupported] = useState<boolean>(true);
  const [isDeviceCompatible, setIsDeviceCompatible] = useState<boolean>(true);
  
  // State for flashlight
  const [hasFlash, setHasFlash] = useState<boolean>(false);
  const [flashOn, setFlashOn] = useState<boolean>(false);
  
  // Refs
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerId = "qr-reader";
  const scanAttemptTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Check browser support
  useEffect(() => {
    // Manual check for media devices API support instead of relying on Html5Qrcode.isSupported()
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsBrowserSupported(false);
      setError("Your browser does not support camera scanning. Please try using a modern browser like Chrome, Firefox, or Safari.");
      return;
    }
    
    // Check for mobile device
    const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (!isMobileDevice && !navigator.mediaDevices) {
      setIsDeviceCompatible(false);
      setError("Your device doesn't support camera access for QR scanning. Please try on a device with a camera.");
      return;
    }
  }, []);

  // Initialize the scanner
  useEffect(() => {
    if (!isBrowserSupported || !isDeviceCompatible) return;
    
    try {
      scannerRef.current = new Html5Qrcode(scannerContainerId);
      
      // Get available cameras with retry mechanism
      const fetchCameras = async (retries = 3) => {
        try {
          const devices = await Html5Qrcode.getCameras();
          if (devices && devices.length) {
            setCameras(devices);
            const backCamera = devices.find(cam => 
              cam.label.toLowerCase().includes('back') || 
              cam.label.toLowerCase().includes('rear')
            );
            // Prefer back camera on mobile devices if available
            setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
            setHasPermission(true);
            
            // Check if device has flashlight capability
            if ('ImageCapture' in window) {
              try {
                const track = await navigator.mediaDevices.getUserMedia({ video: { deviceId: selectedCamera } })
                  .then(stream => stream.getVideoTracks()[0]);
                const capabilities = track.getCapabilities();
                setHasFlash('torch' in capabilities);
                track.stop();
              } catch (e) {
                console.log('Flash detection error:', e);
              }
            }
          } else {
            setError("No cameras found on your device.");
          }
        } catch (err) {
          console.error("Error getting cameras:", err);
          if (retries > 0) {
            // Implement exponential backoff
            const backoffTime = Math.pow(2, 4 - retries) * 1000;
            setTimeout(() => fetchCameras(retries - 1), backoffTime);
          } else {
            setHasPermission(false);
            
            // Set more specific error messages based on error type
            if (err instanceof Error) {
              if (err.name === 'NotAllowedError' || err.message.includes('Permission')) {
                setError("Camera access was denied. Please allow camera access to scan QR codes.");
                setErrorCode("PERMISSION_DENIED");
              } else if (err.name === 'NotFoundError' || err.message.includes('Not found')) {
                setError("No camera found on your device.");
                setErrorCode("NO_CAMERA");
              } else if (err.name === 'NotReadableError' || err.message.includes('Could not start')) {
                setError("Camera is in use by another application or not accessible.");
                setErrorCode("CAMERA_IN_USE");
              } else {
                setError(`Camera error: ${err.message}`);
                setErrorCode("UNKNOWN");
              }
            } else {
              setError("Failed to access camera. Please check your camera permissions.");
              setErrorCode("UNKNOWN");
            }
          }
        }
      };
      
      fetchCameras();
    } catch (error) {
      console.error("Scanner initialization error:", error);
      setError("Failed to initialize QR scanner.");
    }
    
    // Cleanup on unmount
    return () => {
      if (scanAttemptTimeoutRef.current) {
        clearTimeout(scanAttemptTimeoutRef.current);
      }
      stopScanner();
    };
  }, [isBrowserSupported, isDeviceCompatible]);

  // Start scanning when selectedCamera changes
  useEffect(() => {
    if (selectedCamera && hasPermission) {
      startScanner(selectedCamera);
    }
  }, [selectedCamera, hasPermission]);

  const startScanner = async (cameraId: string) => {
    try {
      if (!scannerRef.current) return;
      
      // Always stop the scanner first if it's already running
      if (isScanning) {
        await stopScanner();
        // Add a small delay to ensure resources are properly released
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Set default QR box size if not provided
      const configQrbox = qrbox || ((viewfinderWidth: number, viewfinderHeight: number) => {
        const minEdge = Math.min(viewfinderWidth, viewfinderHeight);
        const boxSize = Math.floor(minEdge * 0.7); // Use 70% of the smaller dimension
        return {
          width: boxSize,
          height: boxSize
        };
      });
      
      console.log("Starting scanner with camera ID:", cameraId);
      
      await scannerRef.current.start(
        cameraId,
        {
          fps,
          qrbox: configQrbox,
          aspectRatio,
          disableFlip,
          formatsToSupport
        },
        (decodedText, decodedResult) => {
          // Successfully scanned a QR code
          if (scanAttemptTimeoutRef.current) {
            clearTimeout(scanAttemptTimeoutRef.current);
          }
          setError(null);
          setErrorCode(null);
          onScanSuccess(decodedText, decodedResult);
        },
        (errorMessage) => {
          // This is an ongoing error during scanning, not a fatal one
          if (verbose && onScanError) {
            onScanError(errorMessage);
          }
        }
      );
      
      setIsScanning(true);
      
      // Set a timeout to detect if no QR code is found after a reasonable time
      scanAttemptTimeoutRef.current = setTimeout(() => {
        if (isScanning && scannerRef.current) {
          setRetryCount(prev => prev + 1);
        }
      }, 15000); // 15 seconds of no successful scan
      
    } catch (err) {
      console.error("Failed to start scanner:", err);
      
      if (err instanceof Error) {
        // More specific error handling based on error type
        if (err.name === 'NotAllowedError' || err.message.includes('Permission')) {
          setError("Camera access was denied. Please allow camera access to scan QR codes.");
          setErrorCode("PERMISSION_DENIED");
        } else if (err.name === 'NotReadableError' || err.message.includes('Could not start')) {
          setError("Camera is in use by another application. Please close other apps using your camera.");
          setErrorCode("CAMERA_IN_USE");
        } else {
          setError(`Failed to start scanner: ${err.message}`);
        }
      } else {
        setError("Failed to start scanner due to an unknown error.");
      }
      
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (scannerRef.current) {
        // Check if it's scanning first
        if (scannerRef.current.getState() === Html5QrcodeScannerState.SCANNING) {
          console.log("Stopping scanner...");
          // Turn off flash if it's on before stopping
          if (flashOn) {
            try {
              await toggleFlash(false);
            } catch (err) {
              console.error("Error turning off flash:", err);
            }
          }
          
          // Stop scanning
          await scannerRef.current.stop();
          console.log("Scanner stopped successfully");
        } else {
          console.log("Scanner is not in scanning state, no need to stop");
        }
      }
      // Always update the UI state
      setIsScanning(false);
    } catch (error) {
      console.error("Failed to stop scanner:", error);
      // Still update the state even on error
      setIsScanning(false);
    }
  };

  const switchCamera = async (cameraId: string) => {
    try {
      // Always stop scanning first
      if (isScanning) {
        await stopScanner();
      }
      
      // Wait a moment for the camera to fully release
      setTimeout(() => {
        setSelectedCamera(cameraId);
        // The useEffect hook will trigger startScanner with the new camera
      }, 500);
    } catch (err) {
      console.error("Error switching camera:", err);
      setError("Failed to switch camera. Please try again.");
    }
  };
  
  const toggleFlash = async (turnOn: boolean) => {
    try {
      if (scannerRef.current && isScanning) {
        await scannerRef.current.applyVideoConstraints({
          advanced: [{ torch: turnOn }]
        });
        setFlashOn(turnOn);
      }
    } catch (err) {
      console.error("Failed to toggle flash:", err);
      // If toggling flash fails, update UI to reflect actual state
      setFlashOn(false);
      setHasFlash(false);
    }
  };
  
  const handleRetry = () => {
    setError(null);
    setErrorCode(null);
    setHasPermission(null);
    setRetryCount(0);
    
    // Force browser to request camera permission again in some cases
    if (errorCode === "PERMISSION_DENIED") {
      if (scannerRef.current) {
        scannerRef.current.clear();
        scannerRef.current = null;
      }
      scannerRef.current = new Html5Qrcode(scannerContainerId);
    }
    
    // Re-request camera access
    Html5Qrcode.getCameras()
      .then(devices => {
        if (devices && devices.length) {
          setCameras(devices);
          const backCamera = devices.find(cam => 
            cam.label.toLowerCase().includes('back') || 
            cam.label.toLowerCase().includes('rear')
          );
          setSelectedCamera(backCamera ? backCamera.id : devices[0].id);
          setHasPermission(true);
        } else {
          setError("No cameras found on your device.");
        }
      })
      .catch(err => {
        console.error("Error getting cameras on retry:", err);
        setHasPermission(false);
        setError("Failed to access camera. Please check your camera permissions.");
      });
  };

  // Handle basic browser/device support issues
  if (!isBrowserSupported) {
    return (
      <div className="qr-scanner-container p-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          <h3 className="font-bold mb-2">Browser Not Supported</h3>
          <p>Your browser does not support camera scanning. Please try using a modern browser like Chrome, Firefox, or Safari.</p>
        </div>
        <a 
          href="https://browser-update.org/update.html"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-primary text-white rounded-lg inline-block"
        >
          Upgrade Browser
        </a>
      </div>
    );
  }
  
  if (!isDeviceCompatible) {
    return (
      <div className="qr-scanner-container p-4 text-center">
        <div className="bg-amber-50 p-4 rounded-lg text-amber-800 mb-4">
          <h3 className="font-bold mb-2">Device Not Compatible</h3>
          <p>Your device doesn't support camera access for QR scanning. Please try on a device with a camera.</p>
        </div>
      </div>
    );
  }

  // Handle permissions error
  if (hasPermission === false) {
    return (
      <div className="qr-scanner-container p-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          <h3 className="font-bold mb-2">Camera Access Denied</h3>
          <p>Camera permission denied. You need to allow camera access to scan QR codes.</p>
          {errorCode === "PERMISSION_DENIED" && (
            <div className="mt-3 text-sm">
              <p>To fix this:</p>
              <ol className="text-left list-decimal ml-5 mt-2">
                <li>Click the camera/lock icon in your browser address bar</li>
                <li>Select "Allow" for camera access</li>
                <li>Refresh this page</li>
              </ol>
            </div>
          )}
        </div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-lg"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Handle other errors
  if (error) {
    return (
      <div className="qr-scanner-container p-4 text-center">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 mb-4">
          <h3 className="font-bold mb-2">Scanner Error</h3>
          <p>{error}</p>
          
          {errorCode === "CAMERA_IN_USE" && (
            <p className="mt-2 text-sm">Please close other applications that might be using your camera.</p>
          )}
          
          {errorCode === "NO_CAMERA" && (
            <p className="mt-2 text-sm">No camera was detected on your device. Please ensure your device has a working camera.</p>
          )}
        </div>
        <button 
          className="px-4 py-2 bg-primary text-white rounded-lg"
          onClick={handleRetry}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="qr-scanner-container">
      {/* Camera selector */}
      {cameras.length > 1 && (
        <div className="camera-switcher mb-4">
          <label className="block text-sm font-medium mb-2">Select Camera</label>
          <select 
            value={selectedCamera}
            onChange={(e) => switchCamera(e.target.value)}
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${camera.id}`}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {/* Scanner area */}
      <div className="scanner-area bg-gray-50 rounded-lg overflow-hidden relative">
        <div id={scannerContainerId} className="w-full"></div>
        
        {/* Controls overlay */}
        {isScanning && (
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            {hasFlash && (
              <button
                type="button"
                onClick={() => toggleFlash(!flashOn)}
                className={`p-2 rounded-full ${flashOn 
                  ? 'bg-primary text-white' 
                  : 'bg-white text-gray-600 border border-gray-300'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5v4h-4l4 8v-4h4l-4-8z"/>
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Loading state */}
        {!isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <div className="text-center">
              <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>Initializing camera...</p>
            </div>
          </div>
        )}
        
        {/* Frame overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="border-2 border-dashed border-primary-light rounded-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3"></div>
          </div>
        )}
      </div>
      
      {/* Instructions and help */}
      <div className="text-center text-sm text-gray mt-4">
        <p>Position the QR code within the frame to scan</p>
        <p className="mt-1">Make sure the QR code is well-lit and clearly visible</p>
        
        {retryCount >= 2 && (
          <div className="mt-3 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm">
            <p className="font-medium">Having trouble scanning?</p>
            <ul className="text-left list-disc ml-5 mt-1">
              <li>Ensure your QR code is not damaged or blurry</li>
              <li>Try in better lighting conditions</li>
              <li>Hold your device steady</li>
              <li>Make sure the entire QR code is visible</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}