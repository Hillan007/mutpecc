import { useState, useEffect } from "react";
import { Link2, Plus, Trash2, Edit2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CommunityLink {
  id: string;
  title: string;
  url: string;
  link_type: string;
  is_premium: boolean;
  is_active: boolean;
  icon: string | null;
  sort_order: number;
}

export function CommunityLinkManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [links, setLinks] = useState<CommunityLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<CommunityLink | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    link_type: "social",
    is_premium: false,
    icon: "",
    sort_order: 0,
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from("community_links")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      if (data) setLinks(data);
    } catch (error) {
      console.error("Error fetching links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLink) {
        const { error } = await supabase
          .from("community_links")
          .update({
            title: formData.title.trim(),
            url: formData.url.trim(),
            link_type: formData.link_type,
            is_premium: formData.is_premium,
            icon: formData.icon.trim() || null,
            sort_order: formData.sort_order,
          })
          .eq("id", editingLink.id);

        if (error) throw error;
        toast({ title: "Link Updated", description: "Community link has been updated." });
      } else {
        const { error } = await supabase.from("community_links").insert({
          title: formData.title.trim(),
          url: formData.url.trim(),
          link_type: formData.link_type,
          is_premium: formData.is_premium,
          icon: formData.icon.trim() || null,
          sort_order: formData.sort_order,
          created_by: user?.id,
        });

        if (error) throw error;
        toast({ title: "Link Added", description: "New community link has been added." });
      }

      handleCloseModal();
      fetchLinks();
    } catch (error) {
      console.error("Error saving link:", error);
      toast({
        title: "Error",
        description: "Failed to save link.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (linkId: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;

    const { error } = await supabase
      .from("community_links")
      .delete()
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete link.",
        variant: "destructive",
      });
    } else {
      toast({ title: "Link Deleted", description: "Community link has been removed." });
      fetchLinks();
    }
  };

  const handleEdit = (link: CommunityLink) => {
    setEditingLink(link);
    setFormData({
      title: link.title,
      url: link.url,
      link_type: link.link_type,
      is_premium: link.is_premium,
      icon: link.icon || "",
      sort_order: link.sort_order,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingLink(null);
    setFormData({
      title: "",
      url: "",
      link_type: "social",
      is_premium: false,
      icon: "",
      sort_order: 0,
    });
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-primary" />
            Community Links
          </CardTitle>
          <Button variant="warm" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Link
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-muted-foreground text-center py-8">Loading...</p>
          ) : links.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No community links yet. Add your first link!
            </p>
          ) : (
            <div className="space-y-3">
              {links.map((link) => (
                <div
                  key={link.id}
                  className="p-4 bg-secondary/50 rounded-xl flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      link.is_premium ? "bg-amber-100" : "bg-primary/10"
                    }`}>
                      <ExternalLink className={`w-5 h-5 ${link.is_premium ? "text-amber-600" : "text-primary"}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{link.title}</p>
                        {link.is_premium && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                            Premium
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground">
                          {link.link_type}
                        </span>
                      </div>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {link.url}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(link)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(link.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingLink ? "Edit Community Link" : "Add Community Link"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="WhatsApp Support Group"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={formData.link_type}
                  onChange={(e) => setFormData({ ...formData, link_type: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                >
                  <option value="social">Social</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="telegram">Telegram</option>
                  <option value="discord">Discord</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Icon (optional)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background"
                  placeholder="whatsapp, instagram, etc."
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_premium}
                  onChange={(e) => setFormData({ ...formData, is_premium: e.target.checked })}
                  className="rounded border-input"
                />
                <span className="text-sm">Premium (Members Only)</span>
              </label>

              <div className="flex items-center gap-2">
                <label className="text-sm">Order:</label>
                <input
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                  className="w-16 px-2 py-1 rounded-lg border border-input bg-background text-center"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleCloseModal} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" variant="warm" className="flex-1">
                {editingLink ? "Update" : "Add"} Link
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}