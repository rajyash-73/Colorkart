import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Palette } from "../types/Palette";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Loader2, ChevronLeft } from "lucide-react";
import { Link } from "wouter";
import { getPalettes, getUserPalettes, deletePalette } from "../lib/localStorageService";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";

export default function SavedPalettes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load palettes from local storage
  useEffect(() => {
    try {
      if (user) {
        const userPalettes = getUserPalettes(user.id);
        setPalettes(userPalettes);
      } else {
        setPalettes([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load palettes'));
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Handle delete palette
  const handleDelete = (palette: Palette) => {
    if (confirm("Are you sure you want to delete this palette?")) {
      try {
        setDeletingId(palette.id);
        deletePalette(palette.id);
        
        // Update the state
        setPalettes(prev => prev.filter(p => p.id !== palette.id));
        
        // Show success message
        toast({
          title: "Palette deleted",
          description: "The palette has been deleted successfully.",
        });
      } catch (err) {
        toast({
          title: "Delete failed",
          description: err instanceof Error ? err.message : "An error occurred",
          variant: "destructive",
        });
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Error Loading Palettes</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <Link href="/">
          <Button>Go Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>My Saved Palettes | Coolors.in</title>
        <meta name="description" content="Access your saved color palettes. View, manage, and load previously created color schemes for your design projects." />
        <link rel="canonical" href="https://coolors.in/saved-palettes" />
        {/* Structured data for collection page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "My Saved Palettes | Coolors.in",
            "description": "Access your saved color palettes and previously created color schemes.",
            "numberOfItems": palettes.length,
            "itemListElement": palettes.map((palette, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "item": {
                "@type": "CreativeWork",
                "name": palette.name,
                "dateCreated": palette.createdAt instanceof Date 
                  ? palette.createdAt.toISOString() 
                  : new Date(palette.createdAt as any).toISOString()
              }
            }))
          })}
        </script>
      </Helmet>
      <header className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div 
            className="cursor-pointer"
            onClick={() => window.location.href = '/'}
          >
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-3xl font-bold">Saved Palettes</h1>
        </div>
        <p className="text-muted-foreground">
          {palettes.length
            ? `You have ${palettes.length} saved palette${palettes.length !== 1 ? "s" : ""}.`
            : "You don't have any saved palettes yet."}
        </p>
      </header>

      {palettes.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <h2 className="text-xl font-medium mb-2">No saved palettes</h2>
          <p className="text-muted-foreground mb-6">
            Create and save palettes from the home page to see them here.
          </p>
          <div
            className="cursor-pointer" 
            onClick={() => window.location.href = '/'}
          >
            <Button>Create New Palette</Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {palettes.map((palette) => (
            <Card key={palette.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{palette.name}</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(palette)}
                    disabled={deletingId === palette.id}
                  >
                    {deletingId === palette.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <CardDescription>
                  {palette.createdAt instanceof Date 
                    ? palette.createdAt.toLocaleDateString() 
                    : new Date(palette.createdAt as any).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div className="flex h-20 rounded overflow-hidden">
                  {palette.colors.map((color, i) => (
                    <div
                      key={i}
                      className="flex-1"
                      style={{ backgroundColor: color.hex }}
                    ></div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div
                  className="cursor-pointer"
                  onClick={() => window.location.href = `/?palette=${palette.id}`}
                >
                  <Button variant="outline" className="w-full">
                    Load Palette
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}