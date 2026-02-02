import { cn } from "@/lib/utils";

type LogoProps = {
    className?: string;
    alt?: string;
};

export function Logo({ className, alt = "MUTPECC" }: LogoProps) {
    return (
        <img
            src="/Mutpecc.png"
            alt={alt}
            className={cn("h-10 w-10 object-contain", className)}
            loading="lazy"
        />
    );
}