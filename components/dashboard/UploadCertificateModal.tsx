"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, X } from "lucide-react";
import { certificateApi } from "@/lib/certificate-api";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadCertificateModalProps {
    children: React.ReactNode;
    onSuccess?: () => void;
}

export default function UploadCertificateModal({ children, onSuccess }: UploadCertificateModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name || !issueDate) {
            setError("Please fill in all fields and select a file.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Upload file to S3
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/users/uploadfile`, {
                method: "POST",
                body: formData,
                // credentials: "include" - we don't strictly need it if the upload endpoint doesn't check auth, but good practice
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok || !uploadData.success) {
                throw new Error(uploadData.error || uploadData.message || "Failed to upload file to S3");
            }

            // 2. Create certificate record in DB
            await certificateApi.uploadCertificate({
                name,
                issueDate,
                imageUrl: uploadData.fileUrl,
            });

            // 3. Reset form and close
            setFile(null);
            setName("");
            setIssueDate("");
            setOpen(false);

            if (onSuccess) {
                onSuccess();
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Upload Certificate</DialogTitle>
                    <DialogDescription>
                        Add a new certificate to your secure vault for verification.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="cert-name">Certificate Name *</Label>
                        <Input
                            id="cert-name"
                            placeholder="e.g. Master of Science in Computer Science"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="issue-date">Issue Date *</Label>
                        <Input
                            id="issue-date"
                            type="date"
                            value={issueDate}
                            onChange={(e) => setIssueDate(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <div className="space-y-2 pb-2">
                        <Label>Certificate File *</Label>
                        {!file ? (
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                onClick={() => fileInputRef.current?.click()}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                    <Upload className="h-5 w-5" />
                                </div>
                                <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                                <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG or WEBP (max. 10MB)</p>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                    accept=".pdf,image/*"
                                />
                            </div>
                        ) : (
                            <div className="border border-gray-200 rounded-lg p-3 flex items-center justify-between bg-gray-50">
                                <div className="flex items-center space-x-3 overflow-hidden">
                                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center flex-shrink-0">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                        <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-500 hover:text-red-600"
                                    onClick={() => setFile(null)}
                                    disabled={loading}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={loading || !file || !name || !issueDate}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload Certificate"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
