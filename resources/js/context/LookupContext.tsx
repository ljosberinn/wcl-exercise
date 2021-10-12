/* eslint-disable promise/prefer-await-to-then, no-console */
import type { ReactNode } from "react";
import {
    useState,
    createContext,
    useContext,
    useCallback,
    useMemo,
    useEffect,
    useRef,
} from "react";

export type CharacterInfo = {
    character: string;
    region: string;
    realm: string;
};

export type LatestParseResponse = {
    meta: {
        fightID: number;
        reportID: string;
    };
    encounter: {
        name: string;
        outOf: number;
        rank: number;
        percentile: number;
    };
    combatant: {
        class: string;
        spec: string;
        region: string;
        realm: string;
        name: string;
        itemLevel: number;
        talents: { icon: string; id: number; name: string }[];
        soulbindPowers: { icon: string; id: number; name: string }[];
        conduitPowers: { icon: string; id: number; name: string }[];
        legendaryEffects: { icon: string; id: number; name: string }[];
        gear: {
            icon: string;
            id: number;
            name: string;
            gems?: { id: number; itemLevel: number }[];
            bonusIDs?: number[];
            permanentEnchant?: number;
            quality: string;
        }[];
    };
};

type CacheEntry = {
    data: LatestParseResponse;
    loadedAt: number;
};

type LookupContextDefinition = {
    loading: boolean;
    cache: Record<string, CacheEntry>;
    loadLatestParse: (params: CharacterInfo) => Promise<void>;
    error: null | string;
};

const LookupContext = createContext<null | LookupContextDefinition>(null);

const useLookupContext = (): LookupContextDefinition => {
    const ctx = useContext(LookupContext);

    if (!ctx) {
        throw new Error("useLookupContext must be used within its provider");
    }

    return ctx;
};

type LookupContextProviderProps = {
    children: ReactNode;
};

const createCharacterKey = ({
    character,
    realm,
    region,
    type,
}: CharacterInfo & { type: "parse" }) =>
    `${region}-${realm}-${character}-${type}`;

const CACHE_EXPIRATION_THRESHOLD = 5 * 60 * 60 * 1000;

const isCacheEntryExpired = (timestamp: number) =>
    Date.now() - timestamp >= CACHE_EXPIRATION_THRESHOLD;

const API_BASE_URL = `/api/wcl`;

export function LookupContextProvider({
    children,
}: LookupContextProviderProps): JSX.Element {
    const [cache, setCache] = useState<LookupContextDefinition["cache"]>({});
    const [loading, setLoading] = useState(false);
    const pendingRequestsRef = useRef(new Map());
    const [error, setError] = useState<null | string>(null);

    /**
     * - loads requested latest parse data of a character
     * - stores it in context state
     */
    const loadLatestParse = useCallback(
        async ({ character, realm, region }: CharacterInfo) => {
            const key = createCharacterKey({
                character,
                realm,
                region,
                type: "parse",
            });

            if (pendingRequestsRef.current.has(key)) {
                return;
            }

            pendingRequestsRef.current.set(key, true);

            setLoading(true);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/latest-parse/${region}/${realm}/${character}`
                );

                const data: LatestParseResponse | { error: string } =
                    await response.json();

                if ("error" in data) {
                    setError(data.error);
                } else {
                    const cacheable = {
                        data,
                        loadedAt: Date.now(),
                    };

                    setCache((prev) => ({
                        ...prev,
                        [key]: cacheable,
                    }));
                    setError(null);
                }

                pendingRequestsRef.current.delete(key);
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    setError(error.message);
                }
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // automatically clear error after 5s
    useEffect(() => {
        if (error) {
            const timeout = setTimeout(() => {
                setError(null);
            }, 5000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [error]);

    const value = useMemo(() => {
        return {
            loading,
            cache,
            loadLatestParse,
            error,
        };
    }, [loading, cache, loadLatestParse, error]);

    return (
        <LookupContext.Provider value={value}>
            {children}
        </LookupContext.Provider>
    );
}

type LatestParseHook = {
    data: LatestParseResponse | null;
    loading: boolean;
    error: null | string;
};

export function useLatestParse(
    characterInfo: CharacterInfo,
    active: boolean
): LatestParseHook {
    const { cache, loadLatestParse, loading, error } = useLookupContext();

    const key = createCharacterKey({
        ...characterInfo,
        type: "parse",
    });

    const cached = key in cache ? cache[key] : null;

    useEffect(() => {
        /**
         * triggers only
         * - if active
         *  AND
         * - no error
         * AND
         * - not cached OR cached data expired
         */
        if (
            active &&
            !error &&
            (!cached || isCacheEntryExpired(cached.loadedAt))
        ) {
            loadLatestParse(characterInfo).catch(console.error);

            // tries to refresh stale data automatically every X minutes
            const timeout = setTimeout(() => {
                loadLatestParse(characterInfo).catch(console.error);
            }, CACHE_EXPIRATION_THRESHOLD);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [active, cache, cached, characterInfo, loadLatestParse, error]);

    const data = cached ? cached.data : null;

    return useMemo(
        () => ({
            data,
            loading,
            error,
        }),
        [loading, data, error]
    );
}
