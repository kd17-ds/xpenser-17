import styles from "./Welcome.module.css";

export default function Welcome() {
    return (
        <div className={styles.WelBox}>
            <h1 className={`MainHeading tracking-in-expand ${styles.WelHead} `}> Fintrack</h1>
        </div>
    )
}
