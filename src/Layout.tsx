import {
	FunctionComponent,
	PropsWithChildren
}                    from "react";
import { Container } from "react-bootstrap";

const Layout : FunctionComponent<PropsWithChildren> = ( { children } ) => {

	return (
		<>
			<div className={ "d-flex flex-column h-100 w-100" }>
				<div className={ "flex-1 overflow-y-auto" }
					 style={ {
						 backgroundImage: "url(\"/images/background/6.jpg\")",
						 backgroundOrigin: "content-box",
						 backgroundRepeat: "no-repeat",
						 backgroundSize: "cover"
					 } }>
					<Container className={ "h-100 p-3" }>
						{ children }
					</Container>
				</div>
			</div>
		</>
	);
};

export default Layout;
