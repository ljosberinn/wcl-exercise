import { Link } from "react-router-dom";

export type GenericErrorProps = {
    message: string;
    goBack?: boolean;
};

export function GenericError({
    message,
    goBack,
}: GenericErrorProps): JSX.Element {
    return (
        <div>
            <div className="flex justify-center pt-4">
                <img
                    src="/assets/inv_misc_bomb_05.jpg"
                    alt="Error"
                    className="w-16 h-16 rounded"
                />
            </div>
            <p className="pb-2 text-center">Oops, encountered an error:</p>

            <code className="block p-2 text-center border-2 border-red-500">
                {message}
            </code>

            {goBack ? (
                <Link to="/" className="block pt-2 text-center">
                    Go back
                </Link>
            ) : null}
        </div>
    );
}
