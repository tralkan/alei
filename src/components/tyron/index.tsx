import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './styles.module.css';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import {
  Deployment,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { Transaction } from '@demox-labs/aleo-wallet-adapter-base';
import { InputBase } from '../scaffold/InputBase';
import { useRouter } from 'next/router';

export default function Tyron() {
  const Router = useRouter();
  const { wallet, publicKey, requestRecords } = useWallet();

  const error_info = 'Info missing.';

  const txn = async (aleoTransaction: Transaction) => {
    const txId =
      (await (wallet?.adapter as LeoWalletAdapter).requestTransaction(
        aleoTransaction
      )) || '';
    console.log('ID:', txId);
    const txStatus =
      (await (wallet?.adapter as LeoWalletAdapter).transactionStatus(txId)) ||
      '';
    console.log('Status:', txStatus);
  };

  const [program_id, setProgramId] = useState<string>('');
  const set_controller = async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      if (program_id == '') {
        alert(error_info);
        throw new Error(error_info);
      }

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        program_id,
        'set_controller',
        [],
        Math.floor(1_000_000),
        false
      );
      console.log(aleoTransaction);
      if (aleoTransaction) {
        await txn(aleoTransaction);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [updateOwner, setUpdateOwner] = useState(false);
  const [new_owner, setNewOwner] = useState<string>('');
  const update_controller = async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      if (new_owner == '' || program_id == '') {
        alert(error_info);
        throw new Error(error_info);
      }

      console.log('Program:', program_id);
      const records = await requestRecords!(program_id);
      const unspentRecord = records.find(
        (record) => !record.spent && record.recordName == 'AppController'
      );

      console.log(records);
      console.log(unspentRecord);

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        program_id,
        'update_controller',
        [unspentRecord, new_owner],
        Math.floor(500_000),
        false
      );
      console.log(aleoTransaction);
      if (aleoTransaction) {
        await txn(aleoTransaction);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [addGuardian, setAddGuardian] = useState(false);
  const [guardian, setGuardian] = useState<string>('');
  const add_guardian = async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      if (guardian == '' || program_id == '') {
        alert(error_info);
        throw new Error(error_info);
      }

      console.log('Program:', program_id);
      const records = await requestRecords!(program_id);
      const unspentRecord = records.find(
        (record) => !record.spent && record.recordName == 'AppController'
      );

      console.log(records);
      console.log('Record:', unspentRecord);

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        program_id,
        'add_guardian',
        [unspentRecord, guardian],
        Math.floor(200_000),
        false
      );
      console.log(aleoTransaction);
      if (aleoTransaction) {
        await txn(aleoTransaction);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [addApproval, setAddApproval] = useState(false);
  const [program_approval, setProgramApproval] = useState<string>('');
  const [owner_approval, setOwnerApproval] = useState<string>('');
  const add_approval = async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      if (program_approval == '' || owner_approval == '') {
        alert(error_info);
        throw new Error(error_info);
      }

      console.log('Program:', program_approval);
      const records = await requestRecords!(program_approval);
      const unspentRecord = records.find(
        (record) => !record.spent && record.recordName == 'Guardian'
      );

      console.log(records);
      console.log('Record:', unspentRecord);

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        program_approval,
        'add_signature',
        [unspentRecord, owner_approval],
        Math.floor(200_000),
        false
      );
      console.log(aleoTransaction);
      if (aleoTransaction) {
        await txn(aleoTransaction);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [addRecover, setAddRecover] = useState(false);
  const recover = async () => {
    try {
      if (!publicKey) throw new WalletNotConnectedError();
      if (!program_approval) {
        alert(error_info);
        throw new Error(error_info);
      }

      console.log('Program:', program_approval);
      const records = await requestRecords!(program_approval);
      const unspentRecord = records.find(
        (record) => !record.spent && record.recordName == 'Guardian'
      );

      console.log(records);
      console.log('Record:', unspentRecord);

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.Testnet,
        program_approval!,
        'social_recovery',
        [unspentRecord, owner_approval],
        Math.floor(200_000),
        false
      );
      console.log(aleoTransaction);
      if (aleoTransaction) {
        await txn(aleoTransaction);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    // console.log('[EOA]', address)
    setAddGuardian(false);
  }, []);

  let [status, setStatus] = useState<string | undefined>();
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.tyronLogo}>
          <Image src="/ssi_$tyron.svg" alt="Tyron" height="40" width="120" />
        </div>
        <h2 className={styles.title}>Self-Sovereign Identity Protocol</h2>
        <div className={styles.content}>
          {/* {status != undefined && <div>{`Transaction status: ${status}`}</div>} */}
          <div className={styles.subtitle}>Get Started</div>
          <ul style={{ paddingLeft: '4%' }}>
            <li>
              1. Your App:
              <section style={{ paddingTop: '3%' }}>
                <InputBase
                  placeholder="Program ID"
                  value={program_id}
                  onChange={setProgramId}
                />
              </section>
            </li>
            {/* <li>
                  1.
                  <span className={styles.button}>
                    <button disabled={deploying} onClick={deploy}>
                      {deploying
                        ? `Deploying...check console for details...`
                        : `Deploy Program`}&#x2197;
                    </button>
                  </span>
                </li> */}
            <li>
              Or{' '}
              <span className={styles.button2}>
                <button onClick={() => Router.push(`/deploy`)}>
                  Deploy New App&#x2197;
                </button>
              </span>
            </li>

            <li>
              2.
              <span onClick={set_controller} className={styles.button}>
                Create Account
              </span>
            </li>
          </ul>
          <div className={styles.subtitle}>Account Ownership</div>
          <ul style={{ paddingLeft: '4%' }}>
            <li>
              <span
                onClick={() =>
                  updateOwner ? setUpdateOwner(false) : setUpdateOwner(true)
                }
                className={styles.button2}
              >
                Update Owner
              </span>
              {updateOwner && (
                <section style={{ padding: '11%' }}>
                  <InputBase
                    placeholder="Address"
                    value={new_owner}
                    onChange={setNewOwner}
                  />
                  <span
                    style={{ marginTop: '3%' }}
                    onClick={update_controller}
                    className={styles.button}
                  >
                    Confirm
                  </span>
                </section>
              )}
            </li>
          </ul>
          <div className={styles.subtitle}>Social Recovery</div>
          <ul style={{ paddingLeft: '4%' }}>
            <section style={{ paddingTop: '4%' }}>
              Add a guardian to secure your account:
              <li style={{ paddingLeft: '4%' }}>
                <span
                  onClick={() =>
                    addGuardian ? setAddGuardian(false) : setAddGuardian(true)
                  }
                  className={styles.button2}
                >
                  Add Guardian
                </span>
                {addGuardian && (
                  <section style={{ padding: '11%' }}>
                    <InputBase
                      placeholder="Address"
                      value={guardian}
                      onChange={setGuardian}
                    />
                    <span
                      style={{ marginTop: '3%' }}
                      onClick={add_guardian}
                      className={styles.button}
                    >
                      Confirm
                    </span>
                  </section>
                )}
              </li>
            </section>

            <section style={{ paddingTop: '4%' }}>
              Be a guardian to another account:
              <li style={{ paddingLeft: '4%' }}>
                <span
                  onClick={() =>
                    addApproval ? setAddApproval(false) : setAddApproval(true)
                  }
                  className={styles.button2}
                >
                  Approve New Owner
                </span>
                {addApproval && (
                  <section style={{ padding: '11%' }}>
                    <InputBase
                      placeholder="Program ID"
                      value={program_approval}
                      onChange={setProgramApproval}
                    />
                    <InputBase
                      placeholder="New owner address"
                      value={owner_approval}
                      onChange={setOwnerApproval}
                    />
                    <span
                      style={{ marginTop: '3%' }}
                      onClick={add_approval}
                      className={styles.button}
                    >
                      Confirm
                    </span>
                  </section>
                )}
              </li>
              <li style={{ paddingLeft: '4%' }}>
                <span
                  onClick={() =>
                    addRecover ? setAddRecover(false) : setAddRecover(true)
                  }
                  className={styles.button2}
                >
                  Recover Account
                </span>
                {addRecover && (
                  <section style={{ padding: '11%' }}>
                    <InputBase
                      placeholder="Program ID"
                      value={program_approval}
                      onChange={setProgramApproval}
                    />
                    <InputBase
                      placeholder="New owner address"
                      value={owner_approval}
                      onChange={setOwnerApproval}
                    />
                    <span
                      style={{ marginTop: '3%' }}
                      onClick={recover}
                      className={styles.button}
                    >
                      Confirm
                    </span>
                  </section>
                )}
              </li>
            </section>
          </ul>
        </div>
      </div>
      <div className={styles.footer}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          height={16}
          width={16}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
        {/* <a href="https://alei.ssiprotocol.com" target="_blank">
          Check out the full documentation here
        </a> */}
        <span
          onClick={() => window.open('https://alei.ssiprotocol.com')}
          className={styles.link}
        >
          Check out the full documentation here&#x2197;
        </span>
      </div>
    </main>
  );
}
