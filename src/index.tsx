import { StrictMode }    from "react";
import App               from "./App";
import { createRoot }    from "react-dom/client";

import "@style/Ribbon.scss";
import "@style/index.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "@kyri123/k-javascript-utils/lib/useAddons";
import { BrowserRouter } from "react-router-dom";

createRoot( document.getElementById( "root" ) as HTMLElement ).render(
	<StrictMode>
		<BrowserRouter>
			<App/>
		</BrowserRouter>
	</StrictMode>
);