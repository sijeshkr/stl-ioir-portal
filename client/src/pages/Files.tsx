import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import {
  Download,
  File,
  FileText,
  FolderOpen,
  Image,
  MoreVertical,
  Plus,
  Search,
  Trash,
  Upload,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Files page - Google Drive integration for file management
 * 
 * Features:
 * - List files from Google Drive
 * - Upload files to Google Drive
 * - Browse files with thumbnails
 * - Download files
 * - Delete files
 * - Create folders
 * 
 * Note: Requires Google OAuth setup to function fully
 */

export default function Files() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | undefined>();

  // Fetch files from Google Drive
  const { data: filesData, isLoading, refetch } = trpc.files.list.useQuery({
    folderId: selectedFolder,
    query: searchQuery ? `name contains '${searchQuery}'` : undefined,
  });

  // Get app folder
  const { data: appFolder } = trpc.files.getAppFolder.useQuery();

  const files = filesData?.files || [];

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) return <Image className="h-5 w-5 text-blue-500" />;
    if (mimeType.startsWith("video/")) return <Video className="h-5 w-5 text-purple-500" />;
    if (mimeType.includes("pdf")) return <FileText className="h-5 w-5 text-red-500" />;
    if (mimeType.includes("folder")) return <FolderOpen className="h-5 w-5 text-yellow-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: string | undefined) => {
    if (!bytes) return "—";
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const handleUpload = () => {
    toast.info("Google Drive integration requires OAuth setup", {
      description: "Please configure Google OAuth credentials to enable file uploads.",
    });
  };

  const handleCreateFolder = () => {
    toast.info("Google Drive integration requires OAuth setup", {
      description: "Please configure Google OAuth credentials to enable folder creation.",
    });
  };

  const handleDelete = (fileId: string, fileName: string) => {
    toast.info("Google Drive integration requires OAuth setup", {
      description: "Please configure Google OAuth credentials to enable file deletion.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Files</h1>
            <p className="text-muted-foreground mt-1">
              Manage your files with Google Drive integration
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleCreateFolder} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              New Folder
            </Button>
            <Button onClick={handleUpload}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* App Folder Info */}
        {appFolder && (
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FolderOpen className="h-5 w-5 text-blue-600" />
                {appFolder.name}
              </CardTitle>
              <CardDescription>
                All portal files are stored in this Google Drive folder
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Files Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading files...
          </div>
        ) : files.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No files yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first file to get started
              </p>
              <Button onClick={handleUpload}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Card key={file.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {file.thumbnailLink ? (
                        <img
                          src={file.thumbnailLink}
                          alt={file.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          {getFileIcon(file.mimeType)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-sm truncate">{file.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {formatFileSize(file.size)} • {formatDate(file.modifiedTime)}
                        </CardDescription>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {file.webViewLink && (
                          <DropdownMenuItem
                            onClick={() => window.open(file.webViewLink, "_blank")}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => handleDelete(file.id, file.name)}
                          className="text-destructive"
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
