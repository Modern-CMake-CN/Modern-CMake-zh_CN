#pragma once

#include <TROOT.h>

class Simple {
    Double_t x;

public:
    Simple() : x(2.5) {}
    Double_t GetX() const;

    ClassDef(Simple,1)
};
