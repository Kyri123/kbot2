import {
	FC,
	useEffect,
	useState
}                        from "react";
import {
	useLocation,
	useParams
}                        from "react-router-dom";
import { usePageTitle }  from "@kyri123/k-reactutils";
import { Button }        from "flowbite-react";
import { validateLogin } from "@hooks/useAuth";


const Index : FC = () => {
	const [ loggedIn, setLoggedIn ] = useState( false );
	const { ErrorCode } = useParams();
	const { pathname } = useLocation();
	usePageTitle( `SBS - Error ${ ErrorCode }` );

	useEffect( () => {
		validateLogin().then( res => setLoggedIn( () => res.loggedIn ) );
	}, [] );

	const Err = {
		code: ErrorCode,
		message: `Page not found!`
	};
	switch ( ErrorCode ) {
		case "403":
		case "401":
			Err.message = `You are not authorized to access this page!`;
			break;
		default:
	}

	return (
		<section className="bg-gray-900 h-full">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0 h-full">
				<span className="text-4xl md:text-8xl text-white">Error { Err.code }</span>
				<span className="text-2xl md:text-4xl mt-5 text-white">{ Err.message }</span>
				<Button href={ loggedIn ? "/" : "/login" } color="gray"
						className="flex items-center justify-center mt-6">{ loggedIn ? "Back to Home" : "Login now!" }</Button>
			</div>
		</section>
	);
};

export default Index;
