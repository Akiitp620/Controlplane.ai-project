package com.trustgate.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {

    private String name;

    private String email;
}
