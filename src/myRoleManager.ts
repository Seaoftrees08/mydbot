import { APIUser, ActionRowBuilder,CommandInteraction, RoleSelectMenuBuilder, RoleSelectMenuInteraction, User,  } from 'discord.js'

export class MyRoleManager{

    private static wantAdd: string[] = [];
    private static wantRemove: string[] = [];

    /**
     * give-roleコマンドを送信したユーザーを追加する
     * 既に追加されている場合はfalseを返す
     * 
     * @param user give-roleコマンドを送信したユーザー
     * @returns 追加に成功したかどうか(成功すればtrue, 失敗すればfalse)
     */
    private static pushWantAdd(user: User): boolean{
        if(this.wantAdd.includes(user.id)) return false;
        this.wantAdd.push(user.id);
        return true;
    }

    /**
     * give-roleコマンドを送信したユーザーから削除する
     * 
     * @param user 削除するユーザー
     */
    private static removeWantAdd(user: User){
        this.wantAdd = this.wantAdd.filter(uid => uid !== user.id);
    }

    /**
     * remove-roleコマンドを送信したユーザーを追加する
     * 
     * @param user remove-roleコマンドを送信したユーザー
     * @returns 追加に成功したかどうか(成功すればtrue, 失敗すればfalse)
     */
    private static pushWantRemove(user: User): boolean{
        if(this.wantRemove.includes(user.id)) return false;
        this.wantRemove.push(user.id);
        return true;
    }

    /**
     * remove-roleコマンドを送信したユーザーから削除する
     * 
     * @param user 削除するユーザー
     */
    private static removeWantRemove(user: User){
        this.wantRemove = this.wantRemove.filter(uid => uid !== user.id);
    }




    /**
     * add-roleを送信した際に呼び出されるメソッド
     * @param interaction スラッシュコマンドをうった際のinteraction
     */
    static async addRoleCommand(interaction: CommandInteraction){

        const selectMenu = new RoleSelectMenuBuilder({
            custom_id: 'a cool select menu',
            placeholder: 'select an option',
            min_values: 1,
        });

        const row = new ActionRowBuilder<RoleSelectMenuBuilder>()
            .addComponents(selectMenu);
        
        await interaction.reply({ 
            content: '付与したいロールを選択してください',
            components: [row],
        });

        this.pushWantAdd(interaction.user);
    }

        /**
     * remove-roleを送信した際に呼び出されるメソッド
     * @param interaction スラッシュコマンドをうった際のinteraction
     */
        static async removeRoleCommand(interaction: CommandInteraction){

            const selectMenu = new RoleSelectMenuBuilder({
                custom_id: 'a cool select menu',
                placeholder: 'select an option',
                min_values: 1,
            });
    
            const row = new ActionRowBuilder<RoleSelectMenuBuilder>()
                .addComponents(selectMenu);
            
            const response = await interaction.reply({ 
                content: '削除したいロールを選択してください',
                components: [row],
            });
    
            this.pushWantRemove(interaction.user);
        }

    static async roleSelected(interaction: RoleSelectMenuInteraction){

        //wantAddに入っているとき、ロールを付与する
        if(this.wantAdd.includes(interaction.user.id)){
            const selectedRoles = interaction.guild?.roles.cache.filter(role => interaction.values?.includes(role.id));
            let includeHierRole = false;
            selectedRoles?.forEach(role => {
                if(role.position >= interaction.message.member!.roles.highest.position) includeHierRole = true;
                if(!interaction.guild?.members.resolve(interaction.user)?.roles.cache.has(role.id)
                    && role.position < interaction.message.member!.roles.highest.position){
                    interaction.message.guild?.members.resolve(interaction.user)?.roles.add(role);
                }
            });
            const optMessage = includeHierRole ? 'ただし、より上位のロールは除外して設定されました' : '';
            interaction.reply(`次のロールを追加しました \`${selectedRoles?.map(role => role.name).join(', ')}\` ${optMessage}`);
            this.removeWantAdd(interaction.user);

        //wantRemoveに入っているとき、ロールを削除する
        }else if(this.wantRemove.includes(interaction.user.id)){
            const selectedRoles = interaction.guild?.roles.cache.filter(role => interaction.values?.includes(role.id));
            let includeHierRole = false;
            selectedRoles?.forEach(role => {
                if(role.position >= interaction.message.member!.roles.highest.position) includeHierRole = true;
                if(interaction.guild?.members.resolve(interaction.user)?.roles.cache.has(role.id)
                    && role.position < interaction.message.member!.roles.highest.position){
                    interaction.message.guild?.members.resolve(interaction.user)?.roles.remove(role);
                }
            });
            const optMessage = includeHierRole ? 'ただし、より上位のロールは除外して設定されました' : '';
            interaction.reply(`次のロールを削除しました \`${selectedRoles?.map(role => role.name).join(', ')}\` ${optMessage}`);
            this.removeWantRemove(interaction.user);

        //どっちにも入っていない場合は返信してその旨を伝える
        }else{
            interaction.reply('先に/give-roleまたは/remove-roleを送信してください');
        }
    }
}