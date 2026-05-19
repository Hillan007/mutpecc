import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FloatingButtons } from "@/components/FloatingButtons";
import { Logo } from "@/components/Logo";

const leaders = [
    {
        name: "Victor Hillan",
        role: "Club Chairperson",
        image: "https://source.unsplash.com/320x320/?lion,cinematic",
        bio: "Leads club initiatives, partnerships, and student outreach.",
    },
    {
        name: "Regina Wambui",
        role: "Vice Chairperson",
        image: "https://source.unsplash.com/320x320/?tiger,cinematic",
        bio: "Coordinates events, logistics, and volunteer engagement.",
    },
    {
        name: "Felister Kaarie",
        role: "Secretary",
        image: "https://source.unsplash.com/320x320/?wolf,cinematic",
        bio: "Manages communications, documentation, and member support.",
    },
    {
        name: "Hesborn Mang'ong'o",
        role: "Organizing Secretary",
        image: "https://source.unsplash.com/320x320/?bear,cinematic",
        bio: "Event planning and coordinationg.",
    },
    {
        name: "Mauline Makena",
        role: "Treasurer",
        image: "https://source.unsplash.com/320x320/?eagle,cinematic",
        bio: "Manages finances, budgeting, and resource allocation.",
    },
    {
        name: "Lisper Njeri",
        role: "Vice Secretary",
        image: "https://source.unsplash.com/320x320/?fox,cinematic",
        bio: "Supports minutes, documentation, and member coordination.",
    },
];

const counselor = {
    name: "Ms Goretti W. Runnoh",
    role: "School Guidance Counselor",
    image: "https://source.unsplash.com/320x320/?owl,wise",
    bio: "M.A Counselling Psychology; B.A. Counselling Psychology; Higher Dip. in Counselling Psychology",
};

const Leaders = () => {
    return (
        <div className="min-h-screen bg-background">
            <Header />
            <FloatingButtons />

            <section className="pt-32 pb-16 lg:pt-40 lg:pb-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl mx-auto text-center"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                            Club Leadership
                            <Logo className="h-4 w-4" />
                            <span className="sr-only">MUTPECC</span>
                        </span>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                            Meet our leaders & guidance counselor
                        </h1>
                        <p className="text-lg text-muted-foreground leading-relaxed">
                            Get to know the student leaders driving MUTPECC and the guidance counselor
                            supporting our community.
                        </p>
                    </motion.div>
                </div>
            </section>

            <section className="pb-16 lg:pb-20">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
                            Club Leaders
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            Your student leadership team for the 2026 academic year.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {leaders.map((leader, index) => (
                            <motion.div
                                key={leader.name}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.08 }}
                                className="bg-card rounded-2xl p-6 shadow-soft border border-border/60"
                            >
                                <img
                                    src={leader.image}
                                    alt={`${leader.name} portrait`}
                                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                                />
                                <h3 className="text-xl font-serif font-semibold text-foreground text-center">
                                    {leader.name}
                                </h3>
                                <p className="text-sm text-muted-foreground text-center mt-1">
                                    {leader.role}
                                </p>
                                <p className="text-sm text-muted-foreground text-center mt-3">
                                    {leader.bio}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="pb-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="mb-10"
                    >
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-3">
                            Guidance Counselor
                        </h2>
                        <p className="text-muted-foreground text-lg">
                            A dedicated professional supporting student wellbeing.
                        </p>
                    </motion.div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-card rounded-2xl p-6 shadow-soft border border-border/60"
                        >
                            <img
                                src={counselor.image}
                                alt={`${counselor.name} portrait`}
                                className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                            />
                            <h3 className="text-xl font-serif font-semibold text-foreground text-center">
                                {counselor.name}
                            </h3>
                            <p className="text-sm text-muted-foreground text-center mt-1">
                                {counselor.role}
                            </p>
                            <p className="text-sm text-muted-foreground text-center mt-3">
                                {counselor.bio}
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Leaders;
