import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { X } from "lucide-react";

export function AddLinkDialog({ onLinkAdded }) {
  const [open, setOpen] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!targetUrl.trim()) {
      newErrors.targetUrl = "URL is required";
    } else {
      try {
        new URL(targetUrl);
      } catch {
        newErrors.targetUrl = "Please enter a valid URL";
      }
    }

    if (customCode.trim() && !/^[A-Za-z0-9]{6,8}$/.test(customCode)) {
      newErrors.customCode = "Code must be 6-8 alphanumeric characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await axios.post("https://smallurl-vcce.onrender.com/api/links", {
        targetUrl: targetUrl.trim(),
        code: customCode.trim() || undefined,
      });

      toast({
        title: "Success",
        description: "Link created successfully",
      });

      setOpen(false);
      setTargetUrl("");
      setCustomCode("");
      setErrors({});
      onLinkAdded();
    } catch (error) {
      if (error.status === 409) {
        setErrors({ customCode: "This code is already taken" });
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to create link",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Add Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="flex items-center justify-between">
            <DialogTitle>Create Short Link</DialogTitle>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
            </div>
            <DialogDescription>
              Enter a long URL and optionally choose a custom short code.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="targetUrl">
                Target URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="targetUrl"
                placeholder="https://example.com/very-long-url"
                value={targetUrl}
                onChange={(e) => {
                  setTargetUrl(e.target.value);
                  if (errors.targetUrl) setErrors({ ...errors, targetUrl: undefined });
                }}
                disabled={loading}
              />
              {errors.targetUrl && (
                <p className="text-sm text-destructive">{errors.targetUrl}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="customCode">Custom Code (optional)</Label>
              <Input
                id="customCode"
                placeholder="e.g., docs123 (6-8 characters)"
                value={customCode}
                onChange={(e) => {
                  setCustomCode(e.target.value);
                  if (errors.customCode) setErrors({ ...errors, customCode: undefined });
                }}
                disabled={loading}
                maxLength={8}
              />
              {errors.customCode && (
                <p className="text-sm text-destructive">{errors.customCode}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Leave empty to generate a random code
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Link"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}