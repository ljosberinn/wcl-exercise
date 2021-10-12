export type GenericErrorProps = {
    message: string;
};

export function GenericError({ message }: GenericErrorProps): JSX.Element {
    return (
        <div>
            <div className="flex justify-center pt-4">
                <img
                    src="/assets/inv_misc_bomb_05.jpg"
                    alt="Error"
                    className="w-16 h-16 rounded"
                />
            </div>
            <p className="text-center">
                Oops, encountered an error: <code>{message}</code>
            </p>
        </div>
    );
}
