import type { Settings } from './settings.types';
import { createCookie } from 'react-router';

const DEFAULT_SETTINGS: Settings = {
  selectedArcadeIds: [],
  selectedGameIds: [],
};

const settingsCookie = createCookie('settings', {
  maxAge: 60 * 60 * 24 * 365,
  httpOnly: true,
});

export async function getSettings(request: Request): Promise<Settings> {
  const cookie = request.headers.get('Cookie');
  const parsed = await settingsCookie.parse(cookie);
  if (!parsed)
    return DEFAULT_SETTINGS;

  return {
    selectedArcadeIds: Array.isArray(parsed.selectedArcadeIds) ? parsed.selectedArcadeIds : [],
    selectedGameIds: Array.isArray(parsed.selectedGameIds) ? parsed.selectedGameIds : [],
  };
}

export async function serializeSettings(settings: Settings): Promise<string> {
  return settingsCookie.serialize(settings);
}
