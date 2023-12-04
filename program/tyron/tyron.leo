// The Tyron Social Recovery program.

program tyron.aleo {
    // @dev app vs account
    mapping accounts: address => Account;
    mapping signers: Signers => u8;

    record Guardian{
        // The guardian.
        owner: address,
        // The account signer.
        signer: address,
    }

    record Controller{
        // The account signer.
        owner: address,
        // The app calling.
        app: address
    }

    struct Account{
        signer: address,
        guardian_count: u8,
    }

    struct Signers{
        current: address,
        new: address
    }

    // @notice Sets initial controller.
    transition set_controller() -> Controller {
        return Controller {
            owner: self.signer,
            app: self.caller
        } then finalize(self.signer, self.caller);
    }

    finalize set_controller(signer: address, app: address) {
        let acc: Account = Account{
            signer: signer,
            guardian_count: 0u8,
        };

        // @dev If the caller already has an account, then throw an error.
        let current_acc: Account = Mapping::get_or_use(accounts, app, acc);
        assert_eq(current_acc, acc);

        // @dev Initialize account.
        Mapping::set(accounts, app, acc);
    }

    // @notice Updates controller. It revokes all guardians.
    transition update_controller(controller: Controller, new_signer: address) -> Controller {
        return Controller {
            owner: new_signer,
            app: self.caller
        } then finalize(new_signer, self.caller);
    }

    finalize update_controller(new_signer: address, app: address) {
        let acc: Account = Account{
            signer: new_signer,
            guardian_count: 0u8,
        };

        // @dev If the caller does not have an account, then throw an error.
        let current_acc: Account = Mapping::get_or_use(accounts, app, acc);
        assert_neq(current_acc, acc);

        // @dev Update account.
        Mapping::set(accounts, app, acc);
    }

    transition add_guardian(app: address, controller: Controller, new_guardian: address) -> (Controller, Guardian) {
        assert_eq(controller.app, app);
        assert_neq(self.signer, new_guardian);
        return (
            Controller {
                owner: self.signer,
                app: self.caller
            },
            Guardian {
            owner: new_guardian,
            signer: self.signer,
        }) then finalize(self.signer, app);
    }

    finalize add_guardian(signer: address, app: address){
        // @dev Update the account info.
        let account: Account = Mapping::get(accounts, app);
        
        let count: u8 = account.guardian_count;
        count += 1u8;

        let update: Account = Account {
            signer: signer,
            guardian_count: count,
        };

        Mapping::set(accounts, app, update);
    }

    transition add_signature(guardian: Guardian, new_signer: address) -> Guardian {
        assert_neq(guardian.signer, new_signer);
        return Guardian {
            owner: self.signer,
            signer: guardian.signer
        } then finalize(guardian.owner, guardian.signer, new_signer);
    }

    finalize add_signature(current_guardian: address, guardian_signer: address, new_signer: address){
        let signer: Signers = Signers {
            current: guardian_signer,
            new: new_signer
        };

        let sigs: u8 = Mapping::get_or_use(signers, signer, 0u8);
        sigs += 1u8;

        Mapping::set(signers, signer, sigs);
    }

    transition social_recovery(app: address, guardian: Guardian, new_signer: address) -> (Controller, Guardian) {
        assert_neq(guardian.signer, new_signer);

        return (
            Controller {
                owner: new_signer,
                app: app
            },
            Guardian {
                owner: self.signer,
                signer: new_signer,
        }) then finalize(app, guardian.signer, new_signer);
    }

    finalize social_recovery(app: address, guardian_signer: address, new_signer: address){
        // @dev Get caller/app account. It must be registered.
        let account: Account = Mapping::get(accounts, app);
        
        // @dev The account signer must be equal to the guardian's signer.
        assert_eq(account.signer, guardian_signer);

        // @dev The guardian threshold must be at least 3.
        let min_three: bool = account.guardian_count >= 3u8;
        assert(min_three);

        // @dev Calculate guardian threshold.
        let threshold: u8 = account.guardian_count.div(2u8).add(1u8);
        
        let signer: Signers = Signers {
            current: guardian_signer,
            new: new_signer
        };

        let sigs: u8 = Mapping::get_or_use(signers, signer, 0u8);
        let verified: bool = sigs >= threshold;
        assert(verified);

        // @dev Update acount.
        let update: Account = Account {
            signer: new_signer,
            guardian_count: 0u8,
        };
        Mapping::set(accounts, app, update);   
    }
}
