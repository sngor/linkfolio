'use client';
import { PropsWithChildren, useEffect } from 'react';
import { configureAmplify } from '@/lib/amplifyClient';
import '@aws-amplify/ui-react/styles.css';

export default function AmplifyProvider({ children }: PropsWithChildren): JSX.Element {
  useEffect(() => {
    configureAmplify();
  }, []);
  return <>{children}</>;
}
