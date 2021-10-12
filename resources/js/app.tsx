import { StrictMode } from "react";
import { render } from "react-dom";
import { BiLinkExternal } from "react-icons/bi";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { ExternalLink } from "./components/ExternalLink";
import { LookupContextProvider } from "./context/LookupContext";
import { LatestParse } from "./routes/LatestParse";
import { ParseLookup } from "./routes/ParseLookup";

render(
    <StrictMode>
        <Router>
            <main className="max-w-3xl m-auto">
                <h1 className="pt-8 font-bold text-center">RPGLogs Exercise</h1>
                <LookupContextProvider>
                    <Switch>
                        <Route
                            path="/:region/:realm/:character"
                            component={LatestParse}
                            exact
                        />
                        <Route path="/" component={ParseLookup} exact />
                    </Switch>
                </LookupContextProvider>
            </main>
            <footer className="flex flex-col justify-center pt-4 pb-8 sm:space-x-2 sm:flex-row">
                <span className="text-center sm:text-initial">Gerrit Alex</span>
                <span className="hidden sm:inline">|</span>
                <ExternalLink
                    href="https://raider.io/characters/eu/blackmoore/Xepheris"
                    className="inline-flex justify-center sm:flex sm:justify-start"
                >
                    Xepheris <BiLinkExternal className="w-4 h-4 ml-2" />
                </ExternalLink>
                <span className="hidden sm:inline">|</span>
                <ExternalLink
                    href="https://github.com/ljosberinn/wcl-exercise"
                    className="inline-flex justify-center sm:flex sm:justify-start"
                >
                    Repository <BiLinkExternal className="w-4 h-4 ml-2" />
                </ExternalLink>
            </footer>
        </Router>
    </StrictMode>,
    document.querySelector("#app")
);
