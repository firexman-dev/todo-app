import { useEffect } from "react";
import { LayoutProps } from "./layout.props"
import { Navbar } from "./navbar/navabar"
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { setToken } from "@/store/actions/auth";
import { useCookies } from "react-cookie";



export const Layout = ({children}: LayoutProps): JSX.Element => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [cookies, setCookie, removeCookie] = useCookies(['todo-token']);
      useEffect(() => {
        if (!cookies["todo-token"]) {
          router.push("/auth/login")
        } else {
          dispatch(setToken(cookies["todo-token"]));
        }
    },[])

    return(
        <>
        <Navbar />
        <main>
            {children}
        </main>
        </>
    )
}
