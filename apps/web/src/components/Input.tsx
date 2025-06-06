interface InputProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
}

export default function Input({ label, value, onChange, placeholder, type = "text" }: InputProps) {
    return (
        <div>
            <label className="block text-sm text-gray-400 mb-2">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white"
            />
        </div>
    );
}
