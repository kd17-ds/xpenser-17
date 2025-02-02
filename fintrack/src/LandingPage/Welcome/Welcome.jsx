import styles from "./Welcome.module.css";

export default function Welcome() {
    return (
        <div>
            <div className={styles.WelBox}>
                <h1 className={`MainHeading tracking-in-expand ${styles.WelHead} `}> Fintrack</h1>
                <br />
                <p className={`SubHeading text-focus-in ${styles.WelFont} `}>" Your go-to app for taking control of your finances.  "</p>
            </div>
            <div className={` slide-top ${styles.HomeContentBox}`}>
            </div>
        </div>
    )
}
