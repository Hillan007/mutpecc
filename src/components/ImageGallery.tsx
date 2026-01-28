import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  description?: string;
}

interface ImageGalleryProps {
  images?: GalleryImage[];
}

export function ImageGallery({ images: propImages }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>(propImages || []);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(!propImages);

  useEffect(() => {
    if (!propImages) {
      fetchGalleryImages();
    }
  }, [propImages]);

  const fetchGalleryImages = async () => {
    try {
      // Fetch images from activities, events, and vlogs
      const [activitiesRes, eventsRes, vlogsRes] = await Promise.all([
        supabase.from("activities").select("id, title, description, image_url").eq("is_published", true).not("image_url", "is", null),
        supabase.from("events").select("id, title, description, image_url").eq("is_published", true).not("image_url", "is", null),
        supabase.from("vlogs").select("id, title, description, thumbnail_url").eq("is_published", true).not("thumbnail_url", "is", null),
      ]);

      const galleryImages: GalleryImage[] = [];

      if (activitiesRes.data) {
        activitiesRes.data.forEach((item) => {
          if (item.image_url) {
            galleryImages.push({
              id: `activity-${item.id}`,
              url: item.image_url,
              title: item.title,
              description: item.description || undefined,
            });
          }
        });
      }

      if (eventsRes.data) {
        eventsRes.data.forEach((item) => {
          if (item.image_url) {
            galleryImages.push({
              id: `event-${item.id}`,
              url: item.image_url,
              title: item.title,
              description: item.description || undefined,
            });
          }
        });
      }

      if (vlogsRes.data) {
        vlogsRes.data.forEach((item) => {
          if (item.thumbnail_url) {
            galleryImages.push({
              id: `vlog-${item.id}`,
              url: item.thumbnail_url,
              title: item.title,
              description: item.description || undefined,
            });
          }
        });
      }

      setImages(galleryImages);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const openLightbox = (index: number) => setSelectedIndex(index);
  const closeLightbox = () => setSelectedIndex(null);

  const goToPrevious = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(selectedIndex === images.length - 1 ? 0 : selectedIndex + 1);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading gallery...</p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-12 max-w-md mx-auto">
        <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Images Yet</h3>
        <p className="text-muted-foreground">
          Images from activities, events, and vlogs will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <motion.button
            key={image.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            onClick={() => openLightbox(index)}
            className="relative aspect-square rounded-xl overflow-hidden group cursor-pointer"
          >
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <p className="text-white text-sm font-medium line-clamp-2">{image.title}</p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Navigation */}
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-8 h-8 text-white" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="w-8 h-8 text-white" />
            </button>

            {/* Image */}
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-4xl max-h-[80vh] relative"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={images[selectedIndex].url}
                alt={images[selectedIndex].title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                <h3 className="text-white text-xl font-semibold">{images[selectedIndex].title}</h3>
                {images[selectedIndex].description && (
                  <p className="text-white/80 text-sm mt-1 line-clamp-2">
                    {images[selectedIndex].description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
              {selectedIndex + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
