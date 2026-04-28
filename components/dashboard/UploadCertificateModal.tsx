"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Upload, FileText, X, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UploadCertificateModalProps {
    children: React.ReactNode;
    onSuccess?: () => void;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export default function UploadCertificateModal({ children, onSuccess }: UploadCertificateModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [file, setFile] = useState<File | null>(null);
    const [name, setName] = useState("");
    const [issueDate, setIssueDate] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    const reset = () => {
        setFile(null); setName(""); setIssueDate(""); setError(null); setSuccess(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !name || !issueDate) {
            setError("Please fill in all fields and select a file."); return;
        }

        setLoading(true); setError(null);

        try {
            // Upload and persist in a single backend call to avoid Cloudinary/DB mismatches
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", name);
            formData.append("issueDate", issueDate);

            const uploadRes = await fetch(`${API_BASE}/certificates/upload-with-file`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadRes.ok || !uploadData.success) {
                throw new Error(uploadData.error || uploadData.message || "Failed to upload certificate");
            }

            // Success
            setSuccess(true);
            setTimeout(() => {
                reset(); setOpen(false);
                if (onSuccess) onSuccess();
            }, 1200);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold text-slate-900">Upload Certificate</DialogTitle>
                    <DialogDescription className="text-slate-500 text-sm">
                        Save a certificate to your vault for future verification.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="flex flex-col items-center justify-center py-8 gap-3">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <p className="text-base font-semibold text-slate-800">Certificate Saved!</p>
                        <p className="text-sm text-slate-500">It will appear in your history shortly.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {error && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50">
                                <AlertDescription className="text-sm text-red-700">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="cert-name" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Certificate Name *</Label>
                            <Input id="cert-name" placeholder="e.g. B.Tech Computer Science" value={name}
                                onChange={(e) => setName(e.target.value)} disabled={loading} required
                                className="h-10 border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="issue-date" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Issue Date *</Label>
                            <Input id="issue-date" type="date" value={issueDate}
                                onChange={(e) => setIssueDate(e.target.value)} disabled={loading} required
                                className="h-10 border-slate-200 bg-slate-50 focus:bg-white" />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Certificate File *</Label>
                            {!file ? (
                                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/40 hover:border-blue-300 transition-all"
                                    onClick={() => fileInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={handleDrop}>
                                    <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-2 border border-blue-100">
                                        <Upload className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-700">Click or drag & drop</p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG (max 10MB)</p>
                                    <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} accept=".pdf,image/*" />
                                </div>
                            ) : (
                                <div className="border border-slate-200 rounded-xl p-3 flex items-center gap-3 bg-slate-50">
                                    <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                    <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-red-500 h-7 w-7" onClick={() => setFile(null)}>
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <Button type="submit" disabled={loading || !file || !name || !issueDate}
                            className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-sm disabled:opacity-50 mt-2">
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Uploading...</> : "Upload Certificate"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
