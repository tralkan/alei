program tyron.aleo;

record Guardian:
    owner as address.private;
    signer as address.private;

record Controller:
    owner as address.private;

struct Account:
    signer as address;
    guardian_count as u8;

struct Signer:
    id as address;


mapping accounts:
	key as address.public;
	value as Account.public;


mapping signers:
	key as address.public;
	value as u8.public;

function init:
    cast self.signer into r0 as Controller.record;
    async init self.signer into r1;
    output r0 as Controller.record;
    output r1 as tyron.aleo/init.future;

finalize init:
    input r0 as address.public;
    contains accounts[aleo1tve29pw8ze7kejtavwpwsv0jjmhrnp22ukgkfqv9x52c9kqelygsyhgjhh] into r1;
    assert.eq r1 false;
    cast r0 0u8 into r2 as Account;
    set r2 into accounts[r0];
    set r2 into accounts[aleo1tve29pw8ze7kejtavwpwsv0jjmhrnp22ukgkfqv9x52c9kqelygsyhgjhh];


function is_signer:
    async is_signer self.signer into r0;
    output r0 as tyron.aleo/is_signer.future;

finalize is_signer:
    input r0 as address.public;
    contains accounts[r0] into r1;
    assert.eq r1 true;


function add_guardian:
    input r0 as address.private;
    assert.neq self.caller r0;
    cast r0 self.caller into r1 as Guardian.record;
    async add_guardian self.caller r0 into r2;
    output r1 as Guardian.record;
    output r2 as tyron.aleo/add_guardian.future;

finalize add_guardian:
    input r0 as address.public;
    input r1 as address.public;
    get accounts[r0] into r2;
    add r2.guardian_count 1u8 into r3;
    cast r0 r3 into r4 as Account;
    set r4 into accounts[r0];


function add_signature:
    input r0 as Guardian.record;
    input r1 as Signer.private;
    input r2 as signature.private;
    async add_signature self.caller r1 r2 into r3;
    output r3 as tyron.aleo/add_signature.future;

finalize add_signature:
    input r0 as address.public;
    input r1 as Signer.public;
    input r2 as signature.public;
    sign.verify r2 r0 r1 into r3;
    assert.eq r3 true;
    get.or_use signers[r1.id] 0u8 into r4;
    add r4 1u8 into r5;
    set r5 into signers[r1.id];


function social_recovery:
    input r0 as Guardian.record;
    input r1 as Signer.private;
    cast r1.id into r2 as Controller.record;
    cast self.caller r1.id into r3 as Guardian.record;
    async social_recovery r0.signer r1.id into r4;
    output r2 as Controller.record;
    output r3 as Guardian.record;
    output r4 as tyron.aleo/social_recovery.future;

finalize social_recovery:
    input r0 as address.public;
    input r1 as address.public;
    get accounts[r0] into r2;
    div r2.guardian_count 2u8 into r3;
    add r3 1u8 into r4;
    get.or_use signers[r1] 0u8 into r5;
    gte r5 r4 into r6;
    assert.eq r6 true;
    remove accounts[r0];
    cast r1 r2.guardian_count into r7 as Account;
    set r7 into accounts[r1];
