import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Trash2, ExternalLink, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";

export function LinksTable({ links, onLinksChange }) {
  const [search, setSearch] = useState("");
  const [deleteCode, setDeleteCode] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

 const formatRelativeTime = (date) => {
  if (!date) return "Never";
  const d = typeof date === "string" ? new Date(date) : date;
  const diff = Date.now() - d.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  return `${days} day${days === 1 ? "" : "s"} ago`;
};

  const copyShortUrl = (code) => {
    if (!code) return;
    const url = `${window.location.origin}/${code}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  const handleDelete = async () => {
    if (!deleteCode) return;

    setDeleting(true);
    try {
      await axios.delete(`https://smallurl-vcce.onrender.com/api/links/${deleteCode}`);
      toast({
        title: "Deleted",
        description: "Link deleted successfully",
      });
      onLinksChange();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete link",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
      setDeleteCode(null);
    }
  };

  const truncateUrl = (url, maxLength = 50) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url;
  };

  if (links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground mb-2">No links yet</p>
        <p className="text-sm text-muted-foreground">
          Create your first short link to get started
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by code or URL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short Code</TableHead>
              <TableHead>Target URL</TableHead>
              <TableHead className="text-center">Clicks</TableHead>
              <TableHead>Last Clicked</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-mono font-medium">
                  <button
                    onClick={() => navigate(`/code/${link.code}`)}
                    className="hover:text-primary hover:underline"
                  >
                    {link.code}
                  </button>
                </TableCell>
                <TableCell>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary inline-flex items-center gap-1"
                  >
                    {truncateUrl(link.url)}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="text-center font-medium">{link.total_clicks}</TableCell>
                <TableCell className="text-muted-foreground">
                  {link.last_clicked_at
                    ? formatRelativeTime(link.last_clicked_at)
                    : "Never"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyShortUrl(link.code)}
                      title="Copy short URL"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteCode(link.code)}
                      title="Delete link"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {links.length === 0 && search && (
        <div className="text-center py-8 text-muted-foreground">
          No links found matching "{search}"
        </div>
      )}

      <AlertDialog open={!!deleteCode} onOpenChange={() => setDeleteCode(null)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Link</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the link <code className="font-mono  font-bold text-xl">{deleteCode}</code>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} onClick={() => setDeleteCode(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}