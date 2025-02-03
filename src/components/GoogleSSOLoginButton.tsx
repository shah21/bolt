import React, { forwardRef, useImperativeHandle } from 'react';
import SSOButtonWrapper from './SSOButtonWrapper';

interface GoogleSSOLoginButtonProps {
  buttonText?: string;
  configs: {
    client_id: string;
  };
  configId?: string;
  setSignupOrganizationDetails?: () => void;
  setRedirectUrlToCookie?: () => void;
}

const GoogleSSOLoginButton = forwardRef<{ triggerLogin: (e?: React.MouseEvent) => void }, GoogleSSOLoginButtonProps>((props, ref) => {
  const randomString = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const buildURLWithQuery = (baseUrl: string, params: Record<string, string>) => {
    const url = new URL(baseUrl);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  };

  const handleGoogleLogin = (e?: React.MouseEvent) => {
    e?.preventDefault();
    props.setSignupOrganizationDetails?.();
    props.setRedirectUrlToCookie?.();

    const authUrl = buildURLWithQuery('https://accounts.google.com/o/oauth2/auth', {
      redirect_uri: `${import.meta.env.VITE_TOOLJET_URL}/sso/google${props.configId ? `/${props.configId}` : ''}`,
      response_type: 'id_token',
      scope: 'email profile',
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      nonce: randomString(10),
      state: 'tj_api_source=ai_onboarding',
    });
    window.location.href = authUrl;
  };

  useImperativeHandle(
    ref,
    () => ({
      triggerLogin: handleGoogleLogin,
    }),
    []
  );

  return (
    <SSOButtonWrapper
      onClick={handleGoogleLogin}
      icon="/assets/images/onboardingassets/SSO/Google.svg"
      text={`${props.buttonText || 'Continue with'} Google`}
      dataCy="google-sso-button"
    />
  );
});

export default GoogleSSOLoginButton; 
