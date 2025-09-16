// Mock authentication for local development
export interface MockUser {
  email: string;
  name: string;
  signInDetails: {
    loginId: string;
  };
}

export interface MockSession {
  tokens: {
    idToken: {
      toString: () => string;
      payload: {
        email: string;
      };
    };
  };
}

class MockAuthService {
  private currentUser: MockUser | null = null;
  private isAuthenticated = false;

  async signIn(email: string, password: string): Promise<MockUser> {
    // Simple mock validation
    if (email && password) {
      this.currentUser = {
        email,
        name: email.split('@')[0],
        signInDetails: {
          loginId: email
        }
      };
      this.isAuthenticated = true;
      localStorage.setItem('mockAuth', JSON.stringify(this.currentUser));
      return this.currentUser;
    }
    throw new Error('Invalid credentials');
  }

  async signUp(email: string, password: string): Promise<MockUser> {
    // Mock signup - same as signin for demo
    return this.signIn(email, password);
  }

  async signOut(): Promise<void> {
    this.currentUser = null;
    this.isAuthenticated = false;
    localStorage.removeItem('mockAuth');
  }

  async getCurrentUser(): Promise<MockUser | null> {
    if (this.currentUser) return this.currentUser;
    
    // Check localStorage for persisted session
    const stored = localStorage.getItem('mockAuth');
    if (stored) {
      this.currentUser = JSON.parse(stored);
      this.isAuthenticated = true;
      return this.currentUser;
    }
    
    return null;
  }

  async fetchAuthSession(): Promise<MockSession | null> {
    const user = await this.getCurrentUser();
    if (!user) return null;

    return {
      tokens: {
        idToken: {
          toString: () => `mock-token-${user.email}`,
          payload: {
            email: user.email
          }
        }
      }
    };
  }

  getAuthenticator() {
    return {
      user: this.currentUser,
      signOut: this.signOut.bind(this)
    };
  }
}

export const mockAuth = new MockAuthService();