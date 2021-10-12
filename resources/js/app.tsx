import { StrictMode } from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { LookupContextProvider } from "./context/LookupContext";
import { LatestParse } from "./routes/LatestParse";
import { ParseLookup } from "./routes/ParseLookup";

render(
    <StrictMode>
        <main className="max-w-3xl m-auto">
            <h1 className="pt-8 font-bold text-center">RPGLogs Exercise</h1>
            <Router>
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
            </Router>
        </main>
    </StrictMode>,
    document.querySelector("#app")
);
