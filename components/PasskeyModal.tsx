"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { decryptKey, encryptKey } from "@/lib/utils";

const PasskeyModal = () => {
  const router = useRouter();
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");

  const encryptedKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem("accessKey")
      : null;

  useEffect(() => {
    const accessKey = encryptedKey && decryptKey(encryptedKey);
    if (path) {
      if (accessKey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
        setIsOpen(false);
        router.push("/admin");
      } else {
        setIsOpen(true);
      }
    }
  }, [encryptedKey]);
  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);
      localStorage.setItem("accessKey", encryptedKey);
      setIsOpen(false);
    } else {
      setError("Invalid passkey, Please try again.");
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    router.push("/");
  };
  return (
    <div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className='shad-alert-dialog'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-start justify-between'>
              Admin acess verification
              <Image
                src='/assets/icons/close.svg'
                alt='close Icon'
                width={20}
                height={20}
                onClick={() => closeModal()}
                className='cursor-pointer'
              />
            </AlertDialogTitle>
            <AlertDialogDescription>
              In order to access the admin panel, please enter the password key.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <InputOTP
              maxLength={6}
              value={passkey}
              onChange={(value) => setPasskey(value)}
            >
              <InputOTPGroup className='shad-otp'>
                <InputOTPSlot className='shad-otp-slot' index={0} />
                <InputOTPSlot className='shad-otp-slot' index={1} />
                <InputOTPSlot className='shad-otp-slot' index={2} />
                <InputOTPSlot className='shad-otp-slot' index={3} />
                <InputOTPSlot className='shad-otp-slot' index={4} />
                <InputOTPSlot className='shad-otp-slot' index={5} />
              </InputOTPGroup>
            </InputOTP>
            {error && (
              <p className='shad-error text-14-regular mt-4 flex justify-center'>
                {error}
              </p>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={(e) => validatePasskey(e)}
              className='shad-primary-btn w-full'
            >
              Enter Admin Passkey
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PasskeyModal;
