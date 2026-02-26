import { google } from 'googleapis';
import { env } from './env';

/**
 * Google Drive integration for file storage and management
 * 
 * This module provides functions to interact with Google Drive API:
 * - Upload files to Google Drive
 * - List files from Google Drive
 * - Get file metadata
 * - Delete files from Google Drive
 * - Share files with specific permissions
 * 
 * Authentication is handled via OAuth 2.0 with user tokens
 */

export interface GoogleDriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink?: string;
  webContentLink?: string;
  thumbnailLink?: string;
  iconLink?: string;
}

export interface UploadFileOptions {
  name: string;
  mimeType: string;
  data: Buffer | string;
  folderId?: string;
}

export interface ListFilesOptions {
  folderId?: string;
  pageSize?: number;
  pageToken?: string;
  query?: string;
}

/**
 * Create Google Drive client with user's access token
 */
export function createDriveClient(accessToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    env.GOOGLE_CLIENT_ID,
    env.GOOGLE_CLIENT_SECRET,
    env.GOOGLE_REDIRECT_URI
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
  });

  return google.drive({ version: 'v3', auth: oauth2Client });
}

/**
 * Upload a file to Google Drive
 */
export async function uploadFile(
  accessToken: string,
  options: UploadFileOptions
): Promise<GoogleDriveFile> {
  const drive = createDriveClient(accessToken);

  const fileMetadata: any = {
    name: options.name,
  };

  if (options.folderId) {
    fileMetadata.parents = [options.folderId];
  }

  const media = {
    mimeType: options.mimeType,
    body: options.data,
  };

  const response = await drive.files.create({
    requestBody: fileMetadata,
    media: media,
    fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink',
  });

  return response.data as GoogleDriveFile;
}

/**
 * List files from Google Drive
 */
export async function listFiles(
  accessToken: string,
  options: ListFilesOptions = {}
): Promise<{ files: GoogleDriveFile[]; nextPageToken?: string }> {
  const drive = createDriveClient(accessToken);

  let query = "trashed = false";
  
  if (options.folderId) {
    query += ` and '${options.folderId}' in parents`;
  }
  
  if (options.query) {
    query += ` and ${options.query}`;
  }

  const response = await drive.files.list({
    q: query,
    pageSize: options.pageSize || 100,
    pageToken: options.pageToken,
    fields: 'nextPageToken, files(id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink)',
    orderBy: 'modifiedTime desc',
  });

  return {
    files: (response.data.files || []) as GoogleDriveFile[],
    nextPageToken: response.data.nextPageToken || undefined,
  };
}

/**
 * Get file metadata from Google Drive
 */
export async function getFile(
  accessToken: string,
  fileId: string
): Promise<GoogleDriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.get({
    fileId: fileId,
    fields: 'id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink, thumbnailLink, iconLink',
  });

  return response.data as GoogleDriveFile;
}

/**
 * Delete a file from Google Drive
 */
export async function deleteFile(
  accessToken: string,
  fileId: string
): Promise<void> {
  const drive = createDriveClient(accessToken);
  await drive.files.delete({ fileId });
}

/**
 * Create a folder in Google Drive
 */
export async function createFolder(
  accessToken: string,
  name: string,
  parentFolderId?: string
): Promise<GoogleDriveFile> {
  const drive = createDriveClient(accessToken);

  const fileMetadata: any = {
    name: name,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    fileMetadata.parents = [parentFolderId];
  }

  const response = await drive.files.create({
    requestBody: fileMetadata,
    fields: 'id, name, mimeType, createdTime, modifiedTime, webViewLink',
  });

  return response.data as GoogleDriveFile;
}

/**
 * Get or create the app's root folder in Google Drive
 */
export async function getOrCreateAppFolder(
  accessToken: string,
  folderName: string = 'STL IOIR Portal Files'
): Promise<GoogleDriveFile> {
  const drive = createDriveClient(accessToken);

  // Search for existing folder
  const response = await drive.files.list({
    q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name, mimeType, createdTime, modifiedTime, webViewLink)',
    pageSize: 1,
  });

  if (response.data.files && response.data.files.length > 0) {
    return response.data.files[0] as GoogleDriveFile;
  }

  // Create folder if it doesn't exist
  return createFolder(accessToken, folderName);
}
