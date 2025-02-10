/* eslint-disable @typescript-eslint/no-unused-vars */

'use client'

import { useToast } from "@/hooks/use-toast";
import { useState, useTransition } from "react";
import { 
    AlertDialog, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

const DeleteDialog = ({ id, action }: { id: string; action: (id: string) => Promise<{ success: boolean; message: string }> }) => {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDeleteClick = () => {
        startTransition(async () => {
            const res = await action(id);
            if (!res.success) {
                toast({
                    variant: 'destructive',
                    description: res.message
                });
            } else {
                setOpen(false);
                toast({
                    description: res.message
                });
            }
        });
    };

    return (
        <AlertDialog onOpenChange={setOpen} open={open}>
            <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive" className="ml-2">
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogDescription>
                    This action cant be undone.
                </AlertDialogDescription>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button onClick={handleDeleteClick} variant="destructive" size="sm" disabled={isPending}>
                        {isPending ? 'Deleting...' : 'Delete'}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default DeleteDialog;
