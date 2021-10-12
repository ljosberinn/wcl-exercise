export function LoadingHourglass(): JSX.Element {
    return (
        <div className="flex justify-center pt-4">
            <img
                src="/assets/achievement_challengemode_auchindoun_hourglass.jpg"
                alt="Loading..."
                className="w-16 h-16 rounded motion-safe:animate-pulse"
            />
        </div>
    );
}
