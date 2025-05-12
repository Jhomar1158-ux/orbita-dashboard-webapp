import { Database } from "@/types/database.types";
import { supabase } from "./supabase";

type TableName = keyof Database["public"]["Tables"];

export class DatabaseService {
  private supabase;

  constructor() {
    this.supabase = supabase;
  }

  async fetchAll(tableName: TableName) {
    const { data, error } = await this.supabase.from(tableName).select("*");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async fetchById(tableName: TableName, id: string) {
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

  async insert(tableName: TableName, data: any) {
    const { data: insertedData, error } = await this.supabase
      .from(tableName)
      .insert(data)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return insertedData;
  }

  async update(tableName: TableName, id: string, data: any) {
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

  async remove(tableName: TableName, id: string) {
    const { error } = await this.supabase.from(tableName).delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
