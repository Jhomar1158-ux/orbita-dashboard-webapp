import { supabase } from "./supabase";

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async fetchAll(tableName: string) {
    const { data, error } = await this.supabase.from(tableName).select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async fetchById(tableName: string, id: string | number) {
    const { data, error } = await this.supabase
      .from(tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async insert(tableName: string, data: any) {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return insertedData;
  }

  async update(tableName: string, id: string | number, data: any) {
    const { data: updatedData, error } = await this.supabase
      .from(tableName)
      .update(data)
      .eq("id", id)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return updatedData;
  }

  async remove(tableName: string, id: string | number) {
    const { error } = await this.supabase.from(tableName).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
