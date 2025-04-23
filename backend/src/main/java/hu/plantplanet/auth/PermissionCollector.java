package hu.plantplanet.auth;

import hu.plantplanet.model.Users;
import hu.plantplanet.service.UsersService;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Getter
@ToString(exclude = "userService")
@EqualsAndHashCode(of = {"user"})
public class PermissionCollector implements UserDetails {

    private final Users user;
    private final UsersService userService;
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private final boolean enabled;

    public PermissionCollector(Users user, UsersService userService) {
        this(user, userService, true, true, true, true);
    }

    public PermissionCollector(Users user, UsersService userService,
                               boolean accountNonExpired, boolean accountNonLocked,
                               boolean credentialsNonExpired, boolean enabled) {
        this.user = Objects.requireNonNull(user, "User cannot be null");
        this.userService = Objects.requireNonNull(userService, "UserService cannot be null");
        this.accountNonExpired = accountNonExpired;
        this.accountNonLocked = accountNonLocked;
        this.credentialsNonExpired = credentialsNonExpired;
        this.enabled = enabled;
        this.authorities = Collections.unmodifiableCollection(loadAuthorities());
    }

    // Must keep these overrides for UserDetails interface
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    // Custom methods
    public String getName() {
        return user.getName();
    }

    public String getEmail() {
        return user.getEmail();
    }

    public String getProfileImage() {
        return user.getProfileImage();
    }

    private Collection<? extends GrantedAuthority> loadAuthorities() {
        if (user.getId() == null) {
            return Collections.emptyList();
        }
        List<String> permissions = userService.findPermissionsByUser(user.getId());
        return permissions.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}