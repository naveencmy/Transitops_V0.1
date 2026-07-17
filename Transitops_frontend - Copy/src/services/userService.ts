

import { supabase } from './supabaseClient';import type { Role } from '../config/permissions';

export interface ManagedUser {id: string;email: string;name: string;role: Role;created_at: string;}

export const userService = {async getUsers(): Promise<ManagedUser[]> {const { data, error } = await supabase.from('profiles').select('id, email, name, role, created_at').order('name', { ascending: true });if (error) throw new Error(error.message);return (data ?? []) as ManagedUser[];},

async updateUserRole(id: string, role: Role): Promise<void> {const { error } = await supabase.from('profiles').update({ role }).eq('id', id);if (error) throw new Error(error.message);},

async updateUserName(id: string, name: string): Promise<void> {const { error } = await supabase.from('profiles').update({ name }).eq('id', id);if (error) throw new Error(error.message);},

async deleteUser(id: string): Promise<void> {const { error } = await supabase.from('profiles').delete().eq('id', id);if (error) throw new Error(error.message);},};