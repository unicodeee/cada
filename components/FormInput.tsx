interface FormInputProps {
    label: string;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
}

const FormInput = ({ label, type, value, onChange, placeholder }: FormInputProps) => (
    <label className="flex flex-col gap-1 w-full">
        <span className="text-sm font-medium">{label}</span>
        <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-lg bg-gray-200 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={placeholder}
            required
        />
    </label>
);

export default FormInput;
