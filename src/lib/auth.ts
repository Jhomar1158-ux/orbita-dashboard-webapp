import { supabase } from "./supabase";

export class AuthService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();

    if (error) {
      throw new Error(error.message);
    }
  }

  async getSession() {
    const { data, error } = await this.supabase.auth.getSession();

    if (error) {
      throw new Error(error.message);
    }

    return data.session;
  }

  async getUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }
}
