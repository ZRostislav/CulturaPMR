import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Image,
  GripVertical,
  X,
} from "lucide-react";
import { Button } from "../../../shared/ui/button";
import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Textarea } from "../../../shared/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../shared/ui/card";

interface Slide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function SliderSettings() {
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "1",
      title: "Welcome to Our Platform",
      description: "Discover amazing features and experiences",
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      buttonText: "Learn More",
      buttonLink: "/learn-more",
    },
    {
      id: "2",
      title: "Join Our Community",
      description: "Connect with thousands of users worldwide",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
      buttonText: "Get Started",
      buttonLink: "/signup",
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Slide>>({});

  const handleAdd = () => {
    const newSlide: Slide = {
      id: Date.now().toString(),
      title: "New Slide",
      description: "Add description here",
      imageUrl:
        "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800",
      buttonText: "Click Here",
      buttonLink: "#",
    };
    setSlides([...slides, newSlide]);
    setEditingId(newSlide.id);
    setFormData(newSlide);
  };

  const handleDelete = (id: string) => {
    setSlides(slides.filter((slide) => slide.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData({});
    }
  };

  const handleEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setFormData(slide);
  };

  const handleSave = () => {
    if (editingId && formData) {
      setSlides(
        slides.map((slide) =>
          slide.id === editingId ? { ...slide, ...formData } : slide
        )
      );
      setEditingId(null);
      setFormData({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({});
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-white">Slider Settings</h2>
          <p className="text-white/60 mt-1">
            Manage your homepage slider content and ordering
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)] shadow-lg shadow-yellow-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Slide
          </Button>
        </motion.div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Slides List */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {slides.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-3"
              >
                {slides.map((slide, index) => (
                  <motion.div
                    key={slide.id}
                    variants={item}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -100 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`bg-[var(--color-neutral-900)] border-white/10 overflow-hidden transition-all ${
                        editingId === slide.id
                          ? "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/10"
                          : "hover:border-white/20"
                      }`}
                    >
                      <CardContent className="p-0">
                        <div className="flex gap-4 p-4">
                          {/* Image */}
                          <motion.div
                            className="w-40 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-neutral-950)]"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.2 }}
                          >
                            {slide.imageUrl ? (
                              <img
                                src={slide.imageUrl}
                                alt={slide.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Image className="h-8 w-8 text-white/30" />
                              </div>
                            )}
                          </motion.div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-md bg-yellow-500/20 text-yellow-400 text-xs">
                                    #{index + 1}
                                  </span>
                                  <h3 className="text-white truncate">
                                    {slide.title}
                                  </h3>
                                </div>
                                <p className="text-white/50 text-sm line-clamp-2 mt-1.5">
                                  {slide.description}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 mt-4">
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(slide)}
                                  className="border-white/20 text-white hover:bg-white/10 hover:border-white/30"
                                >
                                  <Pencil className="h-3 w-3 mr-1.5" />
                                  Edit
                                </Button>
                              </motion.div>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(slide.id)}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                                >
                                  <Trash2 className="h-3 w-3 mr-1.5" />
                                  Delete
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="bg-[var(--color-neutral-900)] border-white/10 border-dashed">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Image className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-white mb-2">No slides yet</h3>
                    <p className="text-white/50 mb-6">
                      Add your first slide to get started with your homepage
                      slider
                    </p>
                    <Button
                      onClick={handleAdd}
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Slide
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Edit Form */}
        <div className="xl:sticky xl:top-6 h-fit">
          <AnimatePresence mode="wait">
            {editingId ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[var(--color-neutral-900)] border-white/10 shadow-xl">
                  <CardHeader className="border-b border-white/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white">Edit Slide</CardTitle>
                        <CardDescription className="text-white/50">
                          Update slide content and settings
                        </CardDescription>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleCancel}
                        className="text-white/50 hover:text-white p-1"
                      >
                        <X className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="title" className="text-white">
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={formData.title || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <Label htmlFor="description" className="text-white">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        maxLength={53}
                        className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 min-h-[100px] focus:border-yellow-500/50 focus:ring-yellow-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="imageUrl" className="text-white">
                        Image URL
                      </Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, imageUrl: e.target.value })
                        }
                        className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        placeholder="https://example.com/image.jpg"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <Label htmlFor="buttonText" className="text-white">
                          Button Text
                        </Label>
                        <Input
                          id="buttonText"
                          value={formData.buttonText || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              buttonText: e.target.value,
                            })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="buttonLink" className="text-white">
                          Button Link
                        </Label>
                        <Input
                          id="buttonLink"
                          value={formData.buttonLink || ""}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              buttonLink: e.target.value,
                            })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex gap-2 pt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div
                        className="flex-1"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSave}
                          className="w-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)] shadow-lg shadow-yellow-500/20"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleCancel}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10"
                        >
                          Cancel
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-[var(--color-neutral-900)] border-white/10 border-dashed">
                  <CardContent className="p-12 text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Pencil className="h-12 w-12 text-white/20 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-white mb-2">Ready to edit</h3>
                    <p className="text-white/50">
                      Select a slide to edit or add a new one
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
