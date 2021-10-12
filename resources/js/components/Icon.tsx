export type IconProps = {
    icon: string;
    alt: string;
    title?: string;
};

export function Icon({ icon, alt, title }: IconProps): JSX.Element {
    return (
        <img
            src={`https://assets.rpglogs.com/img/warcraft/abilities/${icon}`}
            alt={alt}
            className="w-8 h-8 rounded"
            title={title}
        />
    );
}
