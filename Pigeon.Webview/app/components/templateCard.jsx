
import { ToastContainer, toast } from 'react-toastify';

export default function TemplateCard({template}) {
    console.log(template)
    const handleCopy = () => {
        navigator.clipboard.writeText(template.id).then(() => {
            toast.success(template.id+' copied to clipboard');
        }).catch(err => {
            toast.error('Failed to copy: ', err);
        });
    };

    return (
        <a href={`/template/${template.id}`} className="block p-4 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
            <div className="flex flex-col items-center justify-center">
                <div className="text-lg text-white truncate w-40 text-center">{template.name}</div>
                <div className="flex items-center mt-2">
                    <div className="text-sm text-white">{template.id.slice(0, 10) + "..."}</div>
                    <button className="ml-2" onClick={handleCopy}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                        </svg>
                    </button>
                </div>
            </div>
        </a>
    );
}