(impl-trait 'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait)

(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-non-fungible-token stacksies uint)

(define-data-var last-token-id uint u0)

(define-read-only (get-last-token-id)
	(ok (var-get last-token-id))
)

(define-read-only (get-token-uri (token-id uint))
	(ok none)
)

(define-read-only (get-owner (token-id uint))
	(ok (nft-get-owner? stacksies token-id))
)

(define-public (transfer (token-id uint) (sender principal) (recipient principal))
	(begin
		(asserts! (is-eq tx-sender sender) err-not-token-owner)
		(nft-transfer? stacksies token-id sender recipient)
	)
)

(define-public (mint (recipient principal))
	(let
		(
			(token-id (+ (var-get last-token-id) u1))
		)
		(asserts! (is-eq tx-sender contract-owner) err-owner-only)
		(try! (nft-mint? stacksies token-id recipient))
		(var-set last-token-id token-id)
		(ok true)
	)
)

(define-private (private-mint (receiver principal) (id uint))
  (begin
		(is-err (nft-mint? stacksies (+ id u1) receiver))
		(+ id u1)))

(define-public (multi-mint (airdrop1 (list 7000 principal)) (airdrop2 (list 7000 principal)) (airdrop3 (list 996 principal)) (start-last-token-id uint))
  (begin
		(asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (var-set last-token-id (fold private-mint airdrop1 (fold private-mint airdrop2 (fold private-mint airdrop3 start-last-token-id))))
    (ok true)))