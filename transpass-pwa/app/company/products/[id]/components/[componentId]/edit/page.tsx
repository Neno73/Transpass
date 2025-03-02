// Server component for the page
import { Suspense } from 'react';
import EditComponentClient from './edit-component-client';

export default function EditComponentPage({
  params,
}: {
  params: { id: string; componentId: string };
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditComponentClient id={params.id} componentId={params.componentId} />
    </Suspense>
  );
}