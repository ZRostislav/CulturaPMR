import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Trash2,
  Pencil,
  Save,
  Calendar,
  MapPin,
  Ticket,
  DollarSign,
  Users,
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
import { Switch } from "../../../shared/ui/switch";
import { Badge } from "../../../shared/ui/badge";

interface Event {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  totalTickets: number;
  availableTickets: number;
  imageUrl: string;
  isActive: boolean;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function EventManagement() {
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      name: "Summer Music Festival",
      description:
        "Join us for an unforgettable night of music and entertainment",
      date: "2024-07-15",
      time: "18:00",
      location: "Central Park Amphitheater",
      price: 49.99,
      totalTickets: 500,
      availableTickets: 342,
      imageUrl:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
      isActive: true,
    },
    {
      id: "2",
      name: "Tech Conference 2024",
      description:
        "Leading technology experts sharing insights on the future of innovation",
      date: "2024-08-20",
      time: "09:00",
      location: "Convention Center",
      price: 199.99,
      totalTickets: 300,
      availableTickets: 156,
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      isActive: true,
    },
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Event>>({});

  const handleAdd = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: "New Event",
      description: "Event description",
      date: new Date().toISOString().split("T")[0],
      time: "12:00",
      location: "Venue TBD",
      price: 0,
      totalTickets: 100,
      availableTickets: 100,
      imageUrl:
        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
      isActive: false,
    };
    setEvents([...events, newEvent]);
    setEditingId(newEvent.id);
    setFormData(newEvent);
  };

  const handleDelete = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setFormData({});
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData(event);
  };

  const handleSave = () => {
    if (editingId && formData) {
      setEvents(
        events.map((event) =>
          event.id === editingId ? { ...event, ...formData } : event
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

  const toggleActive = (id: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, isActive: !event.isActive } : event
      )
    );
  };

  const getTicketStatus = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 50)
      return { label: "Good", color: "text-green-400 bg-green-400/10" };
    if (percentage > 20)
      return { label: "Limited", color: "text-yellow-400 bg-yellow-400/10" };
    return { label: "Low", color: "text-red-400 bg-red-400/10" };
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
          <h2 className="text-white">Event Management</h2>
          <p className="text-white/60 mt-1">
            Configure available events for ticket purchases
          </p>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleAdd}
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)] shadow-lg shadow-yellow-500/20"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Event
          </Button>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Events</p>
                <motion.p
                  className="text-white mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {events.length}
                </motion.p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Ticket className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Active Events</p>
                <motion.p
                  className="text-white mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {events.filter((e) => e.isActive).length}
                </motion.p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Tickets</p>
                <motion.p
                  className="text-white mt-1"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {events.reduce((sum, e) => sum + e.totalTickets, 0)}
                </motion.p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Events List */}
        <div className="xl:col-span-2 space-y-4">
          <AnimatePresence mode="popLayout">
            {events.length > 0 ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {events.map((event) => {
                  const ticketStatus = getTicketStatus(
                    event.availableTickets,
                    event.totalTickets
                  );

                  return (
                    <motion.div
                      key={event.id}
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
                          editingId === event.id
                            ? "ring-2 ring-yellow-500 shadow-lg shadow-yellow-500/10"
                            : "hover:border-white/20"
                        }`}
                      >
                        <CardContent className="p-0">
                          <div className="flex gap-4 p-4">
                            {/* Image */}
                            <motion.div
                              className="w-48 h-32 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--color-neutral-950)] relative"
                              whileHover={{ scale: 1.05 }}
                              transition={{ duration: 0.2 }}
                            >
                              {event.imageUrl ? (
                                <>
                                  <img
                                    src={event.imageUrl}
                                    alt={event.name}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute top-2 right-2">
                                    <Badge className={ticketStatus.color}>
                                      {ticketStatus.label}
                                    </Badge>
                                  </div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Ticket className="h-8 w-8 text-white/30" />
                                </div>
                              )}
                            </motion.div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="text-white truncate">
                                  {event.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {event.isActive && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs"
                                    >
                                      <motion.div
                                        className="w-1.5 h-1.5 rounded-full bg-green-400"
                                        animate={{ opacity: [1, 0.4, 1] }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                        }}
                                      />
                                      Live
                                    </motion.div>
                                  )}
                                  <Switch
                                    checked={event.isActive}
                                    onCheckedChange={() =>
                                      toggleActive(event.id)
                                    }
                                    className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-400 data-[state=checked]:via-yellow-500 data-[state=checked]:to-yellow-600"
                                  />
                                </div>
                              </div>

                              <p className="text-white/50 text-sm line-clamp-2 mb-3">
                                {event.description}
                              </p>

                              <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <Calendar className="h-4 w-4 text-yellow-500/70" />
                                  <span>
                                    {event.date} • {event.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60">
                                  <DollarSign className="h-4 w-4 text-yellow-500/70" />
                                  <span>${event.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-white/60 col-span-2">
                                  <MapPin className="h-4 w-4 text-yellow-500/70" />
                                  <span className="truncate">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              {/* Ticket Progress */}
                              <div className="space-y-2 mb-4">
                                <div className="flex items-center justify-between text-xs text-white/60">
                                  <span>Tickets Sold</span>
                                  <span>
                                    {event.totalTickets -
                                      event.availableTickets}{" "}
                                    / {event.totalTickets}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600"
                                    initial={{ width: 0 }}
                                    animate={{
                                      width: `${
                                        ((event.totalTickets -
                                          event.availableTickets) /
                                          event.totalTickets) *
                                        100
                                      }%`,
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                  />
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(event)}
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
                                    onClick={() => handleDelete(event.id)}
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
                  );
                })}
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
                      <Ticket className="h-16 w-16 text-white/20 mx-auto mb-4" />
                    </motion.div>
                    <h3 className="text-white mb-2">No events yet</h3>
                    <p className="text-white/50 mb-6">
                      Create your first event to start selling tickets
                    </p>
                    <Button
                      onClick={handleAdd}
                      className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-[var(--color-neutral-950)]"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add First Event
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
                        <CardTitle className="text-white">Edit Event</CardTitle>
                        <CardDescription className="text-white/50">
                          Update event details and settings
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
                      <Label htmlFor="name" className="text-white">
                        Event Name
                      </Label>
                      <Input
                        id="name"
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
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
                        className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 min-h-[80px] focus:border-yellow-500/50 focus:ring-yellow-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <Label htmlFor="date" className="text-white">
                          Date
                        </Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="time" className="text-white">
                          Time
                        </Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time || ""}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="location" className="text-white">
                        Location
                      </Label>
                      <Input
                        id="location"
                        value={formData.location || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white placeholder:text-white/30 focus:border-yellow-500/50 focus:ring-yellow-500/20"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
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
                        placeholder="https://..."
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.35 }}
                      className="grid grid-cols-3 gap-3"
                    >
                      <div>
                        <Label htmlFor="price" className="text-white">
                          Price ($)
                        </Label>
                        <Input
                          id="price"
                          type="number"
                          step="0.01"
                          value={formData.price || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              price: parseFloat(e.target.value),
                            })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="totalTickets" className="text-white">
                          Total
                        </Label>
                        <Input
                          id="totalTickets"
                          type="number"
                          value={formData.totalTickets || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalTickets: parseInt(e.target.value),
                            })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                      <div>
                        <Label
                          htmlFor="availableTickets"
                          className="text-white"
                        >
                          Available
                        </Label>
                        <Input
                          id="availableTickets"
                          type="number"
                          value={formData.availableTickets || 0}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              availableTickets: parseInt(e.target.value),
                            })
                          }
                          className="mt-2 bg-[var(--color-neutral-950)] border-white/20 text-white focus:border-yellow-500/50 focus:ring-yellow-500/20"
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-center justify-between p-4 rounded-lg bg-white/5"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor="isActive"
                          className="text-white cursor-pointer"
                        >
                          Event Active
                        </Label>
                      </div>
                      <Switch
                        id="isActive"
                        checked={formData.isActive || false}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, isActive: checked })
                        }
                        className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-yellow-400 data-[state=checked]:via-yellow-500 data-[state=checked]:to-yellow-600"
                      />
                    </motion.div>

                    <motion.div
                      className="flex gap-2 pt-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.45 }}
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
                      Select an event to edit or add a new one
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
