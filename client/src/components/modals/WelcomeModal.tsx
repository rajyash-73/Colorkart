import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Palette, Lock, Unlock, Mouse, Sliders, Download } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if the user has seen the welcome modal before
    const hasSeenWelcome = localStorage.getItem("hasSeenWelcomeModal");
    
    if (!hasSeenWelcome) {
      // Show the modal if the user hasn't seen it yet
      setIsOpen(true);
      // Mark that the user has seen the welcome modal
      localStorage.setItem("hasSeenWelcomeModal", "true");
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl">
            <Palette className="mr-2 h-6 w-6 text-primary" />
            Welcome to Color Palette Generator!
          </DialogTitle>
          <DialogDescription>
            A simple guide to help you get started
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Generate Colors</h3>
              <p className="text-sm text-muted-foreground">Press the spacebar or click the "Generate" button to create a new color palette.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Lock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Lock Colors</h3>
              <p className="text-sm text-muted-foreground">Click the lock icon on any color to keep it when generating new palettes.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Mouse className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Copy Color Codes</h3>
              <p className="text-sm text-muted-foreground">Click on a color's hex code to copy it to your clipboard.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sliders className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Adjust Colors</h3>
              <p className="text-sm text-muted-foreground">Use the adjustment icon to fine-tune colors with RGB sliders.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Export Palette</h3>
              <p className="text-sm text-muted-foreground">Save your palette as PNG or JSON for later use in your projects.</p>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)}>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}