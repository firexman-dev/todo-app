import Link from "next/link"
import styles from "./navbar.module.css"
import { usePathname } from "next/navigation"
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";

export const Navbar = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['todo-token']);
    const pathname = usePathname();
    const router = useRouter()
    return(
        <>
            <div className={styles.navbar}>
                <div className={styles.main}>
                    <div className={styles.navigations}>
                        <h2>To-do App</h2>
                        <Link href="/" className={`${styles.navigate} ${pathname == "/" ? styles.active : ""}`}>Lists</Link>
                        <Link href="/tasks" className={`${styles.navigate} ${pathname == "/tasks" ? styles.active : ""}`}>Tasks</Link>
                    </div>
                    <span className={styles.navigate}
                    onClick={()=>{
                        removeCookie("todo-token")
                        router.push("/auth/login")
                    }}
                    >
                        Log out
                    </span>
                </div>
            </div>
        </>
    )
}