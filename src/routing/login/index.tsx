import {
	FC,
	FormEvent,
	useRef,
	useState
}                                     from "react";
import {
	json,
	LoaderFunction,
	useLoaderData,
	useNavigate
}                                     from "react-router-dom";
import { validateLogin }              from "@hooks/useAuth";
import { ILoaderDataBase }            from "@app/types/routing";
import { fetchCheckoutJson }          from "@kyri123/k-reactutils";
import { TReq_Auth_Account_Checkout } from "@shared/types/API_Request";
import { TR_Auth_Account_Checkout }   from "@shared/types/API_Response";
import { EApiAuth }                   from "@shared/Enum/EApiPath";
import {
	Button,
	Checkbox,
	Label,
	TextInput
}                                     from "flowbite-react";
import LoadButton                     from "@comp/LoadButton";
import {
	SiDiscord,
	SiGithub,
	SiPatreon,
	SlLogin
}                                     from "react-icons/all";
import { fireToastFromApi }           from "@lib/sweetAlert";

const loader : LoaderFunction = async() => {
	const result = await validateLogin();
	if ( result.loggedIn ) {
		window.location.replace( "/" );
	}
	return json<ILoaderDataBase>( result );
};

const Component : FC = () => {
	const navigate = useNavigate();
	const [ isLoading, setIsLoading ] = useState( false );
	const [ inputError, setInputError ] = useState( [ false, false ] );
	const { loggedIn } = useLoaderData() as ILoaderDataBase;

	const loginRef = useRef<HTMLInputElement>( null );
	const passwordRef = useRef<HTMLInputElement>( null );
	const stayLoggedInRef = useRef<HTMLInputElement>( null );

	if ( loggedIn ) {
		return ( <></> );
	}

	const OnSubmit = async( event : FormEvent<HTMLFormElement> ) => {
		event.preventDefault();

		const username = loginRef.current?.value;
		const password = passwordRef.current?.value;
		const stayLoggedIn = !!stayLoggedInRef.current?.checked;

		if ( username !== undefined && password !== undefined ) {
			setInputError( [ username.length < 6, password.length < 8 ] );
			if ( username.length < 6 || password.length < 8 ) {
				return;
			}

			setIsLoading( true );
			const Response = await fetchCheckoutJson<TReq_Auth_Account_Checkout, TR_Auth_Account_Checkout>( {
				path: EApiAuth.account,
				data: { username, password, stayLoggedIn }
			} ).catch( console.warn );

			if ( Response ) {
				if ( Response.Success ) {
					window.localStorage.setItem( "session", Response.Data.token );
					navigate( "/" );
				}
				else {
					fireToastFromApi( Response );
				}
			}
		}

		setIsLoading( false );
	};

	return (
		<>
			<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl text-white text-center">
				Sign in to your account
			</h1>
			<form className="space-y-4" action="#" onSubmit={ OnSubmit }>
				<TextInput color={ inputError[ 0 ] ? "failure" : "gray" } className="w-full mt-6"
						   placeholder="Discord id or login name" ref={ loginRef }
						   helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Username is too
							   short... must be 6 character long.</> : undefined }/>
				<TextInput color={ inputError[ 1 ] ? "failure" : "gray" } className="w-full mt-6" placeholder="Password"
						   type="password"
						   ref={ passwordRef }
						   helperText={ inputError[ 1 ] ? <><span className="font-medium">Oops!</span> Password is too
							   short... must be 8 character long.</> : undefined }/>

				<div className="flex items-center gap-2 mt-6">
					<Checkbox id="remember" defaultChecked={ true } ref={ stayLoggedInRef }/>
					<Label htmlFor="remember">
						Remember me
					</Label>
				</div>

				<LoadButton className="w-full" isLoading={ isLoading } type={ "submit" }
							icon={ <SlLogin className="mr-3 h-4 w-4"/> }>
					Sign In
				</LoadButton>
				<div className="flex flex-wrap gap-2">
					<Button href={ "https://github.com/Kyri123/kbot2" } target="_blank" color="gray" className="flex-1">
						<SiGithub className="mr-3 h-4 w-4"/>
						Source
					</Button>
					<Button href={ "https://www.patreon.com/kmods" } target="_blank" color="gray" className="flex-1">
						<SiPatreon className="mr-3 h-4 w-4"/>
						Donate
					</Button>
					<Button href={ "https://discord.gg/BeH4GRRWxc" } target="_blank" color="gray" className="flex-1">
						<SiDiscord className="mr-3 h-4 w-4"/>
						Discord
					</Button>
				</div>
			</form>
		</>
	);
};

export {
	Component,
	loader
};
