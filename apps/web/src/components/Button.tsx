interface ButtonProps {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "ghost";
    onClick?: () => void;
}

export default function Button({ children, variant = "primary", onClick }: ButtonProps) {
    const styles = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-white/10 text-white hover:bg-white/20",
        ghost: "text-gray-400 hover:text-white hover:bg-white/10",
    };

    return (
        <button onClick={onClick} className={`px-4 py-2 rounded-lg transition ${styles[variant]}`}>
            {children}
        </button>
    );
}
