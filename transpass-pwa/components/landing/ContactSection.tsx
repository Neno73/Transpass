import React from 'react';

export const ContactSection = () => {
  const contactMethods = [
    {
      title: "Call us",
      details: "+12 34 56 78 90",
      icon: "/icons/phone-icon.svg",
      iconFallback: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Address",
      details: "Lorem ipsum see on the map",
      icon: "/icons/location-icon.svg",
      iconFallback: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 13a3 3 0 100-6 3 3 0 000 6z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      title: "Email",
      details: "contact@transpass.com say hello",
      icon: "/icons/email-icon.svg",
      iconFallback: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22 6l-10 7L2 6" stroke="#3D4EAD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-blue-50 to-white z-0"></div>
      <div className="absolute bottom-0 left-0 right-0 mx-auto w-[2000px] h-[2000px] rounded-full -mb-[1600px]
                      bg-gradient-to-t from-light-blue to-white opacity-50 z-0">
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-navy-800 text-center mb-16">
          Contact
        </h2>
        
        <div className="flex flex-col md:flex-row justify-center items-start space-y-12 md:space-y-0 md:space-x-12 lg:space-x-24">
          {contactMethods.map((method, index) => (
            <div key={index} className="flex items-start">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mr-4 shadow-md">
                {method.iconFallback}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{method.title}</h3>
                <p className="text-gray-600">{method.details}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-24 flex justify-center">
          <div className="text-center">
            <div className="mb-4">
              <svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                <path d="M33 0C14.775 0 0 14.775 0 33s14.775 33 33 33 33-14.775 33-33S51.225 0 33 0z" fill="#3D4EAD" fillOpacity="0.1"/>
                <rect x="15" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="15" y="31" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="15" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="31" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="31" y="31" width="12" height="12" rx="2" fill="#FFFFFF"/>
                <rect x="31" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="47" y="15" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="47" y="31" width="12" height="12" rx="2" fill="#3D4EAD"/>
                <rect x="47" y="47" width="12" height="12" rx="2" fill="#3D4EAD"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-primary uppercase">TRANSPASS</h3>
            <p className="text-sm text-gray-600">from atom to attire</p>
          </div>
        </div>
      </div>
    </section>
  );
};