import { useContext } from 'react';
import { VideoContext } from '../../components/VideoProvider';

export default function useVideoContext() {
  const context = useContext(VideoContext);
  // TODO: use setContext on whether audio/video enabled based on results from api call?
  if (!context) {
    throw new Error('useVideoContext must be used within a VideoProvider');
  }
  return context;
}
